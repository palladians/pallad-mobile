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
			{/* <Tabs.Screen
        name="send/index"
        options={{
          title: "Send",
          href: null,
          headerStyle: {
            backgroundColor: "#000000",
            borderBottomColor: "#000000",
          },
          headerLeft: () => (
            <Link href="/home" asChild>
              <Button variant="link" className="px-4">
                <ButtonIcon as={ChevronLeftIcon} className="w-8 h-8" />
              </Button>
            </Link>
          ),
        }}
      /> */}
			<Tabs.Screen
				name="inbox/index"
				options={{
					title: "Inbox",
					tabBarIcon: ({ color }) => <InboxIcon color={color} size={24} />,
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
