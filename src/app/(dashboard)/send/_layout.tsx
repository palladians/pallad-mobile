import { Button, ButtonIcon } from "@/components/ui/button";
import { Link } from "expo-router";
import { Stack, useRouter } from "expo-router";
import { ArrowLeftIcon, QrCodeIcon } from "lucide-react-native";
import colors from "tailwindcss/colors";

const Layout = () => {
	const router = useRouter();
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
					title: "Send",
					headerLeft: () => (
						<Button
							variant="link"
							onPress={router.back}
							size="lg"
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
					// TODO: Enable when QR code scanning is not crashing on iOS.
					headerRight: () => (
						<Link href="/send/scan" asChild>
							<Button variant="link" size="lg">
								<ButtonIcon as={QrCodeIcon} />
							</Button>
						</Link>
					),
				}}
			/>
			<Stack.Screen
				name="summary"
				options={{
					title: "Summary",
				}}
			/>
			<Stack.Screen
				name="scan"
				options={{
					title: "Scan QR Code",
					presentation: "modal",
					headerStyle: { backgroundColor: colors.neutral[900] },
					contentStyle: { backgroundColor: colors.neutral[900] },
				}}
			/>
		</Stack>
	);
};

export default Layout;
