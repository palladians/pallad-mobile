import { Link } from "expo-router";
import type { ElementType } from "react";
import { Platform } from "react-native";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { View } from "./ui/view";

type DashboardPressable = {
	Icon: ElementType;
	label: string;
	to: string;
};

export const DashboardPressable = ({ Icon, label, to }: DashboardPressable) => {
	const iconSize = Platform.select({ web: 44, ios: 10 });
	return (
		<View className="justify-center items-center gap-2">
			<Link href={to as never} asChild>
				<Pressable className="bg-brand aspect-square justify-center items-center rounded-full h-16">
					<Icon width={40} height={40} />
				</Pressable>
			</Link>
			<Text>{label}</Text>
		</View>
	);
};
