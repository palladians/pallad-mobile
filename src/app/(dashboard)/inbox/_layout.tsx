import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { useVault } from "@/store/vault";
import { Link, Stack, router, useGlobalSearchParams } from "expo-router";
import {
	ArrowUpRightIcon,
	BookUserIcon,
	ClockIcon,
	MoreVerticalIcon,
} from "lucide-react-native";
import colors from "tailwindcss/colors";
import * as WebBrowser from "expo-web-browser";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: colors.black },
				headerTitleStyle: {
					fontFamily: "DMSans_700Bold",
				},
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
					title: "Inbox",
					headerLeft: () => {
						const network = useVault((state) =>
							state.networkMode === "mainnet" ? "mainnet" : "devnet",
						);
						const keyAgent = useVault((state) => state.getCurrentKeyAgent());
						if (!keyAgent) return null;
						const url = `https://minascan.io/${network}/txs/pending-txs?search=${keyAgent.publicKey}`;
						return (
							<Button
								variant="link"
								className="mr-4"
								size="lg"
								onPress={() => WebBrowser.openBrowserAsync(url)}
							>
								<ButtonIcon
									as={ClockIcon}
									width={24}
									height={24}
									color={colors.neutral[200]}
								/>
							</Button>
						);
					},
					headerRight: () => (
						<Link href="/contacts" asChild>
							<Button variant="link" size="lg">
								<ButtonIcon
									as={BookUserIcon}
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
				name="transaction/[hash]"
				options={{
					title: "Transaction Details",
					presentation: "modal",
					headerStyle: { backgroundColor: colors.neutral[900] },
					contentStyle: { backgroundColor: colors.neutral[900] },
				}}
			/>
			<Stack.Screen
				name="[publicKey]"
				options={{
					headerRight: () => {
						const { publicKey } = useGlobalSearchParams();
						return (
							<HStack className="gap-4">
								<Link href={`/send?receiver=${publicKey}`} asChild>
									<Button variant="link" size="lg">
										<ButtonIcon
											as={ArrowUpRightIcon}
											width={28}
											height={28}
											color={colors.neutral[200]}
										/>
									</Button>
								</Link>
								<Button
									variant="link"
									onPress={() => router.setParams({ menuVisible: "true" })}
									size="lg"
								>
									<ButtonIcon
										as={MoreVerticalIcon}
										width={28}
										height={28}
										color={colors.neutral[200]}
									/>
								</Button>
							</HStack>
						);
					},
				}}
			/>
		</Stack>
	);
};

export default Layout;
