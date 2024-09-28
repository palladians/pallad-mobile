import type { Message } from "@/hooks/use-inbox";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Text } from "./ui/text";
import { View } from "./ui/view";

export const ChatPreview = ({
	participantName,
	participantImage,
	lastMessage,
}: {
	participantName: string;
	participantImage: string | null;
	lastMessage: Message;
}) => {
	return (
		<View className="flex flex-row gap-4 p-4 border-b border-gray-900">
			<Avatar>
				<AvatarFallbackText>{participantName}</AvatarFallbackText>
				{participantImage ? (
					<AvatarImage source={{ uri: participantImage }} />
				) : null}
			</Avatar>
			<View className="flex flex-1 flex-col">
				<View className="flex flex-row justify-between">
					<Text>{participantName}</Text>
					<Text className="text-gray-400 text-sm">{lastMessage.date}</Text>
				</View>
				<Text className="text-gray-400">{lastMessage.content}</Text>
			</View>
		</View>
	);
};
