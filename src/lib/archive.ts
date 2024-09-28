import type { ExternalTransactionData } from "@/types";
import { ofetch } from "ofetch";

export const constructTransactionsUrl = (publicKey: string) => {
	const url = new URL(
		`https://minascan.io/mainnet/api/api/core/accounts/${publicKey}/activity`,
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

type FetchHistoricalTransactionsProps = {
	publicKey: string;
};

export type HistoricalTransactionsResponse = {
	data: ExternalTransactionData[];
};

export const fetchHistoricalTransactions = async ({
	publicKey,
}: FetchHistoricalTransactionsProps) => {
	const { data } = await ofetch<HistoricalTransactionsResponse>(
		constructTransactionsUrl(publicKey),
	);
	return data;
};
