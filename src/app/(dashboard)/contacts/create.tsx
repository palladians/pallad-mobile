import { Button, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { useVault } from "@/store/vault";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";

const ContactSchema = z.object({
	name: z.string(),
	address: z.string().length(55),
});

const ContactCreateRoute = () => {
	const router = useRouter();
	const addContact = useVault((state) => state.addContact);
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(ContactSchema),
	});
	const { field: nameField } = useController({ name: "name", control });
	const { field: addressField } = useController({ name: "address", control });

	const createContact = handleSubmit(async (data) => {
		addContact(data as never);
		return router.back();
	});

	return (
		<ScrollView contentContainerClassName="flex-grow justify-between gap-8 p-4">
			<VStack className="gap-4">
				<FormControl>
					<FormControlLabel>
						<FormControlLabelText>Name</FormControlLabelText>
					</FormControlLabel>
					<Input size="lg" className="rounded-full">
						<InputField
							value={nameField.value}
							onChangeText={nameField.onChange}
							onBlur={nameField.onBlur}
						/>
					</Input>
				</FormControl>
				<FormControl>
					<FormControlLabel>
						<FormControlLabelText>Address</FormControlLabelText>
					</FormControlLabel>
					<Input size="lg" className="rounded-full">
						<InputField
							value={addressField.value}
							onChangeText={addressField.onChange}
							onBlur={addressField.onBlur}
						/>
					</Input>
				</FormControl>
			</VStack>
			<VStack className="gap-2">
				<Button
					size="xl"
					className="rounded-full bg-brand"
					onPress={createContact}
				>
					<ButtonText>Create</ButtonText>
				</Button>
				<Button size="xl" className="rounded-full" onPress={router.back}>
					<ButtonText>Cancel</ButtonText>
				</Button>
			</VStack>
		</ScrollView>
	);
};

export default ContactCreateRoute;
