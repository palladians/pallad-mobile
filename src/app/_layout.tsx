import "@web3modal/polyfills";
import "react-native-get-random-values";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";
import { Providers } from "@/components/providers";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	useFonts,
	DMSans_400Regular,
	DMSans_500Medium,
	DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

dayjs.extend(relativeTime);

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, error] = useFonts({
		DMSans_400Regular,
		DMSans_500Medium,
		DMSans_700Bold,
	});

	useEffect(() => {
		if (!fontsLoaded) return;
		SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (error) return null;

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<Providers>
			<SafeAreaView className="flex flex-1 flex-col">
				<Slot />
			</SafeAreaView>
		</Providers>
	);
}
