import { Stack } from "expo-router";

const OnboardingLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="start" />
			<Stack.Screen name="import" />
		</Stack>
	);
};

export default OnboardingLayout;
