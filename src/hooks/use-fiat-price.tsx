import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export const useFiatPrice = () => {
	return useSWR<{ "mina-protocol": { usd: number; usd_24h_change: number } }>(
		"https://api.coingecko.com/api/v3/simple/price?ids=mina-protocol&vs_currencies=usd&include_24hr_change=true",
		fetcher,
	);
};
