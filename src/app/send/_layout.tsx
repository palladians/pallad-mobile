import { Button, ButtonIcon } from "@/components/ui/button";
import { Link, Stack } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Send",
					headerStyle: {
						backgroundColor: "#000000",
					},
					headerLeft: () => (
						<Link href="/home" asChild>
							<Button variant="link">
								<ButtonIcon as={ChevronLeftIcon} className="w-8 h-8" />
							</Button>
						</Link>
					),
				}}
			/>
			<Stack.Screen
				name="summary"
				options={{
					title: "Summary",
					headerStyle: {
						backgroundColor: "#000000",
					},
					headerLeft: () => (
						<Link href="/send" asChild>
							<Button variant="link">
								<ButtonIcon as={ChevronLeftIcon} className="w-8 h-8" />
							</Button>
						</Link>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
