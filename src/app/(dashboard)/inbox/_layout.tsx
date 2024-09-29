import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Stack, router } from "expo-router";
import { MoreVerticalIcon } from "lucide-react-native";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Inbox",
					headerRight: () => (
						<Button variant="link">
							<ButtonText>Contacts</ButtonText>
						</Button>
					),
				}}
			/>
			<Stack.Screen
				name="transaction/[hash]"
				options={{ title: "Transaction Details", presentation: "modal" }}
			/>
			<Stack.Screen
				name="[publicKey]"
				options={{
					headerRight: () => (
						<Button
							variant="link"
							onPress={() => router.setParams({ menuVisible: "true" })}
						>
							<ButtonIcon as={MoreVerticalIcon} />
						</Button>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
