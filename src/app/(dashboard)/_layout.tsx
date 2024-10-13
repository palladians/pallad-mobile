import { View } from "@/components/ui/view";
import { useVault } from "@/store/vault";
import * as LocalAuthentication from "expo-local-authentication";
import { Tabs } from "expo-router";
import { CircleUserIcon, HomeIcon, InboxIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";

const DashboardLayout = () => {
	const biometricsRequired = useVault((state) => state.biometricsRequired);
	const [authenticated, setAuthenticated] = useState(!biometricsRequired);

	useEffect(() => {
		if (!biometricsRequired) return;
		LocalAuthentication.authenticateAsync().then((result) => {
			if (result.success) {
				setAuthenticated(true);
			}
		});
	}, [biometricsRequired]);

	if (!authenticated) return <View className="flex-1 bg-black" />;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#F6C076",
				tabBarLabelStyle: {
					fontSize: 12,
					fontFamily: "DMSans_700Bold",
				},
				tabBarStyle: {
					backgroundColor: colors.black,
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
				name="contacts"
				options={{
					title: "Contacts",
					href: null,
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
				name="id"
				options={{
					title: "ID",
					tabBarIcon: ({ color }) => <CircleUserIcon color={color} size={24} />,
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="stake"
				options={{
					title: "Stake",
					headerShown: false,
					href: null,
				}}
			/>
		</Tabs>
	);
};

export default DashboardLayout;
