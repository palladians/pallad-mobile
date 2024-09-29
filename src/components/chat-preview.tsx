import type { Message } from "@/hooks/use-inbox";
import { dateFromNow } from "@/lib/utils";
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
}: {
	participantName: string;
	participantAddress: string;
	participantImage: string | null;
	lastMessage: Message;
}) => {
	return (
		<Pressable
			className="flex flex-row gap-4 p-4 border-b border-zinc-800 w-full"
			onPress={() => router.push(`/inbox/${participantAddress}`)}
		>
			<Avatar className="bg-zinc-400">
				<AvatarFallbackText>{participantName}</AvatarFallbackText>
				{participantImage ? (
					<AvatarImage source={{ uri: participantImage }} />
				) : null}
			</Avatar>
			<View className="flex flex-1 flex-col">
				<View className="flex flex-row justify-between">
					<Text className="text-white">{participantName}</Text>
					<Text className="text-gray-400 text-sm">
						{dateFromNow(lastMessage.date)}
					</Text>
				</View>
				<Text className="text-gray-400">{lastMessage.content}</Text>
			</View>
		</Pressable>
	);
};
