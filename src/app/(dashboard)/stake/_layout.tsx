import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Link, Stack, useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
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
					title: "Stake",
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
					headerRight: () => (
						<Link href="/send?txType=4" asChild>
							<Button variant="link" size="lg">
								<ButtonText>Delegate</ButtonText>
							</Button>
						</Link>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
