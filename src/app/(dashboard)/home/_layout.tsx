import { Stack } from "expo-router";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen
				name="receive"
				options={{
					title: "Receive",
					presentation: "modal",
				}}
			/>
		</Stack>
	);
};

export default Layout;
