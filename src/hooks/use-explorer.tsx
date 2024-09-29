import { useVault } from "@/store/vault";

type BuildTxUrlProps = {
	network: string;
	hash: string;
};

const buildTxUrl = ({ network, hash }: BuildTxUrlProps) => {
	return `https://minascan.io/${network}/tx/${hash}/txInfo`;
};

const buildAccountUrl = ({
	network,
	address,
}: {
	network: string;
	address: string;
}) => {
	return `https://minascan.io/${network}/account/${address}`;
};

export const useExplorer = () => {
	const networkMode = useVault((state) => state.networkMode);
	const network = networkMode === "mainnet" ? "mainnet" : "devnet";

	return {
		getTxUrl: (hash: string) => buildTxUrl({ network, hash }),
		getAccountUrl: (address: string) => buildAccountUrl({ network, address }),
	};
};
