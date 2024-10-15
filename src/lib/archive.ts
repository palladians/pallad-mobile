import type { ExternalTransactionData } from "@/types";

export type MinaNetwork = "mainnet" | "devnet";

export type ConstructTransactionsUrlProps = {
  publicKey: string;
  network: MinaNetwork;
};

export const constructTransactionsUrl = ({
  publicKey,
  network,
}: ConstructTransactionsUrlProps) => {
  const url = new URL(
    `https://minascan.io/${network}/api/api/core/accounts/${publicKey}/activity`,
  );
  url.searchParams.append("page", "0");
  url.searchParams.append("limit", "200");
  url.searchParams.append("sortBy", "age");
  url.searchParams.append("orderBy", "DESC");
  url.searchParams.append("size", "200");
  url.searchParams.append("pk", publicKey);
  url.searchParams.append("direction", "all");
  return url.toString();
};

export type HistoricalTransactionsResponse = {
  data: ExternalTransactionData[];
};

export type ConstructTransactionUrlProps = {
  hash: string;
  network: MinaNetwork;
};

export const constructTransactionUrl = ({
  hash,
  network,
}: ConstructTransactionUrlProps) => {
  return `https://minascan.io/${network}/api/api/core/transactions/${hash}`;
};

export const constructAccountUrl = ({
  publicKey,
  network,
}: ConstructTransactionsUrlProps) => {
  return `https://minascan.io/${network}/api/api/core/accounts/${publicKey}/info`;
};

export const constructPendingTransactionsUrl = ({
  publicKey,
  network,
}: ConstructTransactionsUrlProps) => {
  const url = new URL(
    `https://minascan.io/${network}/api/api/core/transactions/pending`,
  );
  url.searchParams.append("page", "0");
  url.searchParams.append("limit", "20");
  url.searchParams.append("sortBy", "AMOUNT");
  url.searchParams.append("orderBy", "DESC");
  url.searchParams.append("size", "20");
  url.searchParams.append("searchStr", publicKey);
  return url.toString();
};

export const constructDelegateeUrl = ({
  publicKey,
  network,
}: ConstructTransactionsUrlProps) => {
  return `https://minascan.io/${network}/api/api/core/accounts/${publicKey}/delegatee`;
};
