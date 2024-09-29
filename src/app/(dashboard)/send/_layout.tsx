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
				}}
			/>
			<Stack.Screen
				name="summary"
				options={{
					title: "Summary",
				}}
			/>
		</Stack>
	);
};

export default Layout;
