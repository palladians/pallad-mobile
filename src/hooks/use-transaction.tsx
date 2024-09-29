import { constructTransactionUrl } from "@/lib/archive";
import { fetcher } from "@/lib/utils";
import { useVault } from "@/store/vault";
import type { ExternalDetailedTransactionData } from "@/types";
import useSWR from "swr";

type UseTransactionProps = {
	hash: string;
};

export const useTransaction = ({ hash }: UseTransactionProps) => {
	const networkMode = useVault((state) => state.networkMode);
	const network = networkMode === "mainnet" ? "mainnet" : "devnet";
	const url = constructTransactionUrl({
		hash,
		network,
	});
	return useSWR<ExternalDetailedTransactionData>(url, fetcher);
};
