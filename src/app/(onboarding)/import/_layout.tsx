import { Button, ButtonText } from "@/components/ui/button";
import { useVault } from "@/store/vault";
import { Link, Stack } from "expo-router";
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
					title: "Import Wallet",
					headerLeft: () => {
						const keyAgents = useVault((state) => state.keyAgents);
						const url = keyAgents.length > 0 ? "/home" : "/start";
						return (
							<Link href={url} asChild>
								<Button variant="link" size="lg">
									<ButtonText>Back</ButtonText>
								</Button>
							</Link>
						);
					},
				}}
			/>
		</Stack>
	);
};

export default Layout;
