import { ChatEntry } from "@/components/chat-entry";
import { ChatMenu } from "@/components/chat-menu";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { type Message, useInbox } from "@/hooks/use-inbox";
import { dateFromNow } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

const DateMessages = ({
	date,
	messages,
}: {
	date: string;
	messages: Message[];
}) => {
	return (
		<View className="flex flex-col">
			<Text className="text-center text-xs text-neutral-500">
				{dateFromNow(date)}
			</Text>
			<FlashList
				data={messages?.reverse()}
				renderItem={({ item }) => <ChatEntry message={item} />}
				className="mt-2"
				estimatedItemSize={92}
			/>
		</View>
	);
};

const ChatRoute = () => {
	const router = useRouter();
	const navigation = useNavigation();
	const { publicKey, menuVisible } = useLocalSearchParams();
	const { inbox, mutate, isLoading } = useInbox({
		participantAddress: publicKey.toString(),
	});
	const chat = inbox[0];
	const messagesByDate = chat?.messages ? Object.entries(chat.messages) : [];
	const chatMenuVisible = menuVisible?.toString() === "true";

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: chat?.participantName,
		});
	}, [chat?.participantName, navigation.setOptions]);

	return (
		<View className="flex flex-1 flex-col">
			<FlashList
				data={messagesByDate}
				renderItem={({ item }) => (
					<DateMessages date={item[0]} messages={item[1]} />
				)}
				contentContainerClassName="pt-4 pb-16" // Careful, inverted values top-bottom
				onRefresh={mutate}
				refreshing={isLoading}
				inverted
				estimatedItemSize={116}
			/>
			<ChatMenu
				open={chatMenuVisible}
				onClose={() => router.setParams({ menuVisible: "false" })}
				address={chat?.participantAddress}
			/>
		</View>
	);
};

export default ChatRoute;
