import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import type { ElementType } from "react";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { View } from "./ui/view";

type DashboardPressable = {
	Icon: ElementType;
	label: string;
	to: string;
	disabled?: boolean;
};

export const DashboardPressable = ({
	Icon,
	label,
	to,
	disabled,
}: DashboardPressable) => {
	return (
		<View className="justify-center items-center gap-2">
			<Link href={to as never} onPress={Haptics.selectionAsync} asChild>
				<Pressable
					className="bg-brand aspect-square justify-center items-center rounded-full h-16 disabled:opacity-50"
					disabled={disabled}
				>
					<Icon width={40} height={40} />
				</Pressable>
			</Link>
			<Text className="font-dm-bold text-neutral-200">{label}</Text>
		</View>
	);
};
