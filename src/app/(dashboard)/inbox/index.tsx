import { ChatPreview } from "@/components/chat-preview";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useInbox } from "@/hooks/use-inbox";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";

const InboxRoute = () => {
	const { inbox } = useInbox();
	return (
		<SafeAreaView className="flex flex-1 flex-col">
			<FlashList
				data={inbox}
				renderItem={({ item }) => (
					<Link href={`/inbox/${item.participantAddress}`}>
						<ChatPreview
							participantName={item.participantName}
							participantImage={item.participantImage}
							lastMessage={item.messages[0]}
						/>
					</Link>
				)}
				estimatedItemSize={81}
			/>
		</SafeAreaView>
	);
};

export default InboxRoute;
