import {
  type HistoricalTransactionsResponse,
  constructTransactionsUrl,
} from "@/lib/archive";
import { fetcher, truncateString } from "@/lib/utils";
import { useVault } from "@/store/vault";
import type { ExternalTransactionData } from "@/types";
import dayjs from "dayjs";
import * as Rambda from "rambda";
import useSWR from "swr";
import { useWallet } from "./use-wallet";

export type MessageType = "payment" | "message";

export type Message = {
  hash: string;
  sender: string;
  content: string;
  amount: number;
  timestamp: number;
  date: string;
  txType: "payment" | "delegation";
  type: MessageType;
};

type CreateInboxProps = {
  transactions: ExternalTransactionData[];
  hideTinyTransactions: boolean;
};

const createInbox = ({
  transactions,
  hideTinyTransactions,
}: CreateInboxProps) => {
  const groupedTransactions = Rambda.groupBy(
    (transaction: ExternalTransactionData) => {
      return transaction.direction === "IN"
        ? transaction.senderAddress
        : transaction.receiverAddress;
    },
    transactions,
  );

  // Convert grouped transactions to chats
  return Rambda.map((group: ExternalTransactionData[]) => {
    const participantAddress =
      group[0].direction === "IN"
        ? group[0].senderAddress
        : group[0].receiverAddress;
    const participantName =
      group[0].direction === "IN"
        ? (group[0].senderName ??
          truncateString({
            value: group[0].senderAddress,
            endCharCount: 5,
            firstCharCount: 5,
          }))
        : (group[0].receiverName ??
          truncateString({
            value: group[0].receiverAddress,
            endCharCount: 5,
            firstCharCount: 5,
          }));
    const participantImage =
      group[0].direction === "IN" ? group[0].senderImg : group[0].receiverImg;

    const messages = Rambda.map((transaction: ExternalTransactionData) => {
      if (
        transaction.type === "payment" &&
        hideTinyTransactions &&
        transaction.amount < 1
      ) {
        return undefined;
      }
      const actionLabel =
        transaction.direction === "IN"
          ? "Received"
          : transaction.type === "payment"
            ? "Sent"
            : "Delegated";
      return {
        hash: transaction.transactionHash,
        sender:
          transaction.direction === "IN" ? transaction.senderAddress : "me",
        content:
          transaction.memo || `${actionLabel} ${transaction.amount} MINA`,
        timestamp: transaction.age,
        date: dayjs(transaction.age).format("YYYY-MM-DD"),
        amount: transaction.amount,
        txType: transaction.type,
        type: (transaction.memo.length > 0
          ? "message"
          : "payment") as MessageType,
      };
    }, group).filter(Boolean) as Message[];

    const messagesByDate = Rambda.groupBy(
      (message: Message) => message.date,
      Rambda.sort((a, b) => b.timestamp - a.timestamp, messages),
    );

    return {
      participantAddress,
      participantName,
      participantImage,
      messages: messagesByDate,
    };
  }, Rambda.values(groupedTransactions));
};

type UseInboxProps = {
  participantAddress: string | undefined;
};

export const useInbox = (
  { participantAddress }: UseInboxProps = { participantAddress: undefined },
) => {
  const networkMode = useVault((state) => state.networkMode);
  const hideTinyTransactions = useVault((state) => state.hideTinyTransactions);
  const network = networkMode === "mainnet" ? "mainnet" : "devnet";
  const { getWallet } = useWallet();
  const wallet = getWallet();
  const { data, isLoading, error, mutate } =
    useSWR<HistoricalTransactionsResponse>(
      [
        wallet?.publicKey
          ? constructTransactionsUrl({
            publicKey: wallet?.publicKey,
            network,
          })
          : null,
        network,
      ],
      ([url]) => fetcher(url),
    );
  const inbox = data?.data
    ? createInbox({
      transactions: data?.data,
      hideTinyTransactions,
    })
    : [];
  return {
    inbox: participantAddress
      ? inbox.filter((i) => i.participantAddress === participantAddress)
      : inbox,
    isLoading,
    error,
    mutate,
  };
};
