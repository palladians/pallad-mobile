import { Button, ButtonIcon } from "@/components/ui/button";
import { useVault } from "@/store/vault";
import { Stack, useRouter } from "expo-router";
import { ArrowLeftIcon, Share2Icon } from "lucide-react-native";
import { Share } from "react-native";
import colors from "tailwindcss/colors";

const Layout = () => {
	const router = useRouter();
	const keyAgent = useVault((state) => state.getCurrentKeyAgent());
	const walletLink = `mina://send?address=${keyAgent?.publicKey}`;
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.black,
				},
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
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen
				name="receive"
				options={{
					title: "Receive",
					presentation: "modal",
					headerLeft: () => (
						<Button
							size="lg"
							variant="link"
							onPress={router.back}
							className="mr-4"
						>
							<ButtonIcon
								as={ArrowLeftIcon}
								width={24}
								height={24}
								color={colors.neutral[200]}
							/>
						</Button>
					),
					headerRight: () => (
						<Button
							size="lg"
							variant="link"
							onPress={async () => {
								await Share.share({
									message: walletLink,
								});
							}}
						>
							<ButtonIcon
								as={Share2Icon}
								width={24}
								height={24}
								color={colors.neutral[200]}
							/>
						</Button>
					),
					headerStyle: { backgroundColor: colors.neutral[900] },
					contentStyle: { backgroundColor: colors.neutral[900] },
				}}
			/>
		</Stack>
	);
};

export default Layout;
