import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { type Message, useInbox } from "@/hooks/use-inbox";
import { FlashList } from "@shopify/flash-list";
import { clsx } from "clsx";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

const ChatMessage = ({ message }: { message: Message }) => {
	return (
		<View
			className={clsx(
				"flex flex-row bg-gray-900 mb-2 mx-4 p-4 rounded-2xl",
				message.sender === "me"
					? "bg-blue-500 self-end rounded-br-none"
					: "bg-gray-900 self-start rounded-bl-none",
			)}
		>
			<Text>{message.content}</Text>
		</View>
	);
};

const ChatRoute = () => {
	const navigation = useNavigation();
	const { publicKey } = useLocalSearchParams();
	const { inbox } = useInbox({ participantAddress: publicKey.toString() });
	const chat = inbox[0];

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: chat.participantName,
		});
	}, [chat.participantName, navigation.setOptions]);

	return (
		<SafeAreaView className="flex flex-1 flex-col">
			<FlashList
				data={chat.messages}
				renderItem={({ item }) => <ChatMessage message={item} />}
				className="pt-4 pb-2"
				inverted
				estimatedItemSize={64}
			/>
		</SafeAreaView>
	);
};

export default ChatRoute;
