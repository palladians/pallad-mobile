import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { truncateString } from "@/lib/utils";
import { type Contact, useVault } from "@/store/vault";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";

const ContactEntry = ({ contact }: { contact: Contact }) => {
	return (
		<Link href={`/send?receiver=${contact.address}`}>
			<HStack className="p-4 gap-4">
				<Avatar className="bg-neutral-300 rounded-full">
					<AvatarFallbackText>{contact.name}</AvatarFallbackText>
				</Avatar>
				<VStack>
					<Text
						className="text-neutral-200
"
					>
						{contact.name}
					</Text>
					<Text size="sm" className="text-neutral-400">
						{truncateString({
							value: contact.address,
							firstCharCount: 5,
							endCharCount: 5,
						})}
					</Text>
				</VStack>
			</HStack>
		</Link>
	);
};

const ContactsRoute = () => {
	const contacts = useVault((state) => state.contacts);
	return (
		<FlashList
			data={contacts}
			renderItem={({ item }) => <ContactEntry contact={item} />}
			estimatedItemSize={64}
		/>
	);
};

export default ContactsRoute;
