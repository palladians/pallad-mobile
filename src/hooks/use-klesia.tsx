import { useVault } from "@/store/vault";
import useSWR from "swr";

type UseKlesiaProps = {
	network: string;
	method: string;
	params: any[];
};

export const klesiaFetcher = async ({
	method,
	network,
	params,
}: UseKlesiaProps) => {
	const reqUrl = `https://${network}.klesia.palladians.xyz/api`;
	const req = await fetch(reqUrl, {
		method: "POST",
		body: JSON.stringify({
			method,
			params,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return req.json();
};

export const useKlesia = <T,>({ network, method, params }: UseKlesiaProps) => {
	const keyAgent = useVault((state) => state.getCurrentKeyAgent());
	if (!keyAgent) return null;
	return useSWR<T>([method, network, keyAgent.id], ([method]) =>
		klesiaFetcher({ method, network, params }),
	);
};
