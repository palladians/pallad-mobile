import { ChatPreview } from "@/components/chat-preview";
import { useInbox } from "@/hooks/use-inbox";
import { FlashList } from "@shopify/flash-list";

const InboxRoute = () => {
	const { inbox, mutate, isLoading } = useInbox();
	return (
		<FlashList
			data={inbox}
			renderItem={({ item, index }) => (
				<ChatPreview
					participantName={item.participantName}
					participantAddress={item.participantAddress}
					participantImage={item.participantImage}
					lastMessage={Object.values(item.messages)[0].reverse()[0]}
					className={index === 0 ? "border-t" : ""}
				/>
			)}
			estimatedItemSize={81}
			refreshing={isLoading}
			onRefresh={mutate}
		/>
	);
};

export default InboxRoute;
