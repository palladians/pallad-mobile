import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import React from "react";
import type { PropsWithChildren } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SWRConfig } from "swr";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<SWRConfig
			value={{
				provider: () => new Map(),
				isVisible: () => {
					return true;
				},
				initFocus(callback) {
					let appState = AppState.currentState;
					const onAppStateChange = (nextAppState: AppStateStatus) => {
						if (
							appState.match(/inactive|background/) &&
							nextAppState === "active"
						) {
							callback();
						}
						appState = nextAppState;
					};
					const subscription = AppState.addEventListener(
						"change",
						onAppStateChange,
					);
					return () => {
						subscription.remove();
					};
				},
			}}
		>
			<GluestackUIProvider mode="dark">
				<ThemeProvider value={DarkTheme}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						{children}
					</GestureHandlerRootView>
				</ThemeProvider>
			</GluestackUIProvider>
		</SWRConfig>
	);
};
