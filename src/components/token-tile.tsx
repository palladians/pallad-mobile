import type { ElementType, ReactNode } from "react";
import colors from "tailwindcss/colors";
import { Text } from "./ui/text";
import { View } from "./ui/view";

export type TokenTileProps = {
	name: string;
	ticker: string;
	amount: string;
	Icon: ElementType;
	fiatTicker: string;
	fiatValue: string;
	fiatChange: string;
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
			<Icon width={44} height={44} color={colors.black} />
			<View className="flex-1 justify-center">
				<Text className="text-neutral-200 text-lg font-dm-bold">{name}</Text>
				<Text className="text-neutral-400">
					{amount} {ticker}
				</Text>
			</View>
			<View className="justify-center items-end">
				<View className="flex-row gap-2 items-end">
					<Text className="text-neutral-400">{fiatTicker}</Text>
					<Text className="text-lg text-neutral-200">{fiatValue}</Text>
				</View>
				<Text className="text-neutral-400">{fiatChange}%</Text>
			</View>
		</View>
	);
};
