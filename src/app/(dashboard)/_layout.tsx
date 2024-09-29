import { Tabs } from "expo-router";
import { CircleUserIcon, HomeIcon, InboxIcon } from "lucide-react-native";

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
				name="inbox"
				options={{
					title: "Inbox",
					tabBarIcon: ({ color }) => <InboxIcon color={color} size={24} />,
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="send"
				options={{
					title: "Send",
					href: null,
					headerShown: false,
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
