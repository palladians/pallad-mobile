import {
	type HistoricalTransactionsResponse,
	constructTransactionsUrl,
} from "@/lib/archive";
import { truncateString } from "@/lib/utils";
import type { ExternalTransactionData } from "@/types";
import dayjs from "dayjs";
import { ofetch } from "ofetch";
import * as Rambda from "rambda";
import useSWR from "swr";
import { useWallet } from "./use-wallet";

export type Message = {
	sender: string;
	content: string;
	timestamp: number;
	date: string;
};

type CreateInboxProps = {
	transactions: ExternalTransactionData[];
};

const createInbox = ({ transactions }: CreateInboxProps) => {
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

		const messages = Rambda.map(
			(transaction: ExternalTransactionData) => ({
				sender:
					transaction.direction === "IN" ? transaction.senderAddress : "me",
				content:
					transaction.memo ||
					`${transaction.direction === "IN" ? "Received" : "Sent"} ${
						transaction.amount
					} MINA`,
				timestamp: transaction.age,
				date: dayjs(transaction.age).format("MMM DD"),
			}),
			group,
		);

		return {
			participantAddress,
			participantName,
			participantImage,
			messages: Rambda.sort((a, b) => b.timestamp - a.timestamp, messages),
		};
	}, Rambda.values(groupedTransactions));
};

type UseInboxProps = {
	participantAddress: string | undefined;
};

export const useInbox = (
	{ participantAddress }: UseInboxProps = { participantAddress: undefined },
) => {
	const { getWallet } = useWallet();
	const wallet = getWallet();
	const { data, isLoading, error } = useSWR<HistoricalTransactionsResponse>(
		wallet?.publicKey ? constructTransactionsUrl(wallet?.publicKey) : null,
		ofetch,
	);
	const inbox = data?.data
		? createInbox({
				transactions: data?.data,
			})
		: [];
	return {
		inbox: participantAddress
			? inbox.filter((i) => i.participantAddress === participantAddress)
			: inbox,
		isLoading,
		error,
	};
};
