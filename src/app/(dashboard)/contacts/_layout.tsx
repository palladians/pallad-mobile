import { Button, ButtonIcon } from "@/components/ui/button";
import { Link, Stack } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import colors from "tailwindcss/colors";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: colors.black },
				headerShadowVisible: false,
				headerTintColor: colors.neutral[200],
				headerBackTitleStyle: {
					fontFamily: "DMSans_700Bold",
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Contacts",
					headerRight: () => (
						<Link href="/contacts/create" asChild>
							<Button variant="link" size="lg">
								<ButtonIcon
									as={PlusIcon}
									width={24}
									height={24}
									color={colors.neutral[200]}
								/>
							</Button>
						</Link>
					),
				}}
			/>
			<Stack.Screen
				name="create"
				options={{
					title: "Create Contact",
					presentation: "modal",
					headerStyle: { backgroundColor: colors.neutral[900] },
					contentStyle: { backgroundColor: colors.neutral[900] },
				}}
			/>
		</Stack>
	);
};

export default Layout;
