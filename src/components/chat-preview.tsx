import type { Message } from "@/hooks/use-inbox";
import { dateFromNow } from "@/lib/utils";
import { clsx } from "clsx";
import { router } from "expo-router";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { View } from "./ui/view";

export const ChatPreview = ({
	participantName,
	participantAddress,
	participantImage,
	lastMessage,
	className,
}: {
	participantName: string;
	participantAddress: string;
	participantImage: string | null;
	lastMessage: Message | undefined;
	className?: string;
}) => {
	if (!lastMessage) return null;
	const openChat = async (participantAddress: string) => {
		router.push(`/inbox/${participantAddress}`);
	};
	return (
		<Pressable
			className={clsx(
				"flex flex-row gap-4 p-4 border-b border-neutral-800 w-full active:bg-neutral-900",
				className,
			)}
			onPress={() => openChat(participantAddress)}
		>
			<Avatar className="bg-neutral-400">
				<AvatarFallbackText>{participantName}</AvatarFallbackText>
				{participantImage ? (
					<AvatarImage source={{ uri: participantImage }} />
				) : null}
			</Avatar>
			<View className="flex flex-1 flex-col">
				<View className="flex flex-row justify-between">
					<Text className="text-neutral-200">{participantName}</Text>
					<Text className="text-neutral-400 text-sm">
						{dateFromNow(lastMessage.date)}
					</Text>
				</View>
				<Text className="text-neutral-400">{lastMessage.content}</Text>
			</View>
		</Pressable>
	);
};
