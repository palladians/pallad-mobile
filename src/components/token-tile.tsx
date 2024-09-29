import type { ElementType, ReactNode } from "react";
import { Text } from "./ui/text";
import { View } from "./ui/view";

export type TokenTileProps = {
	name: string;
	ticker: string;
	amount: number;
	Icon: ElementType;
	fiatTicker: string;
	fiatValue: number;
	fiatChange: number;
};

export const TokenTile = ({
	name,
	ticker,
	amount,
	Icon,
	fiatTicker,
	fiatValue,
	fiatChange,
}: TokenTileProps) => {
	return (
		<View className="flex-row gap-4 items-center">
			<Icon width={44} height={44} color="#000000" />
			<View className="flex-1 justify-center">
				<Text className="text-white">{name}</Text>
				<Text className="text-zinc-400">
					{amount} {ticker}
				</Text>
			</View>
			<View className="justify-center items-end">
				<View className="flex-row gap-2 items-end">
					<Text className="text-zinc-400">{fiatTicker}</Text>
					<Text className="text-lg text-white">{fiatValue}</Text>
				</View>
				<Text className="text-zinc-400">{fiatChange * 100}%</Text>
			</View>
		</View>
	);
};
