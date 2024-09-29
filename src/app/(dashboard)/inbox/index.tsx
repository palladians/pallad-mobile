import { ChatPreview } from "@/components/chat-preview";
import { useInbox } from "@/hooks/use-inbox";
import { FlashList } from "@shopify/flash-list";

const InboxRoute = () => {
	const { inbox } = useInbox();
	return (
		<FlashList
			data={inbox}
			renderItem={({ item }) => (
				<ChatPreview
					participantName={item.participantName}
					participantAddress={item.participantAddress}
					participantImage={item.participantImage}
					lastMessage={Object.values(item.messages)[0][0]}
				/>
			)}
			estimatedItemSize={81}
		/>
	);
};

export default InboxRoute;
