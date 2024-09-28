import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Link, Tabs } from "expo-router";
import {
	ChevronLeftIcon,
	CircleUserIcon,
	HomeIcon,
	InboxIcon,
} from "lucide-react-native";

const DashboardLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#F6C076",
				tabBarLabelStyle: {
					fontSize: 12,
				},
				tabBarStyle: {
					backgroundColor: "#000000",
					borderTopColor: "#374151",
					height: 88,
					paddingBottom: 32,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="inbox/index"
				options={{
					title: "Inbox",
					tabBarIcon: ({ color }) => <InboxIcon color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="inbox/[publicKey]"
				options={{
					title: "Inbox",
					href: null,
				}}
			/>
			<Tabs.Screen
				name="id/index"
				options={{
					title: "ID",
					tabBarIcon: ({ color }) => <CircleUserIcon color={color} size={24} />,
				}}
			/>
		</Tabs>
	);
};

export default DashboardLayout;
