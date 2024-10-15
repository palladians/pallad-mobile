import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useVault } from "@/store/vault";
import { Alert, Platform } from "react-native";
import colors from "tailwindcss/colors";
import packageJson from "../../../../package.json";
import { Link, useRouter } from "expo-router";

const SettingsRoute = () => {
	const router = useRouter();
	const biometricsRequired = useVault((state) => state.biometricsRequired);
	const networkMode = useVault((state) => state.networkMode);
	const setBiometricsRequired = useVault(
		(state) => state.setBiometricsRequired,
	);
	const setNetworkMode = useVault((state) => state.setNetworkMode);
	const hideTinyTransactions = useVault((state) => state.hideTinyTransactions);
	const setHideTinyTransactions = useVault(
		(state) => state.setHideTinyTransactions,
	);
	const keyAgent = useVault((state) => state.getCurrentKeyAgent());
	const setAccountConnectivity = useVault((state) => state.setConnectivity);
	const removeCurrentKeyAgent = useVault(
		(state) => state.removeCurrentKeyAgent,
	);
	const resetVault = useVault((state) => state.reset);

	const devnetMode = networkMode === "testnet";
	const toggleDevnetMode = () => {
		setNetworkMode(devnetMode ? "mainnet" : "testnet");
	};
	const changeAccountConnectivity = () => {
		if (!keyAgent) return;
		const newConnectivity = keyAgent.connectivity === "usb" ? "ble" : "usb";
		return setAccountConnectivity(newConnectivity);
	};

	const onRemoveCurrentAccount = () => {
		return Alert.alert(
			"Remove current account",
			"Are you sure you want to remove the current account?",
			[
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						const count = removeCurrentKeyAgent() ?? 0;
						if (count > 0) {
							return router.replace("/home");
						}
						return router.replace("/start");
					},
				},
				{
					text: "Cancel",
					style: "cancel",
				},
			],
		);
	};

	const onWipePallad = () => {
		return Alert.alert("Wipe Pallad", "Are you sure you want to wipe Pallad?", [
			{
				text: "Wipe",
				style: "destructive",
				onPress: () => {
					resetVault();
					return router.replace("/start");
				},
			},
			{
				text: "Cancel",
				style: "cancel",
			},
		]);
	};

	return (
		<ScrollView contentContainerClassName="flex-grow p-4 gap-8 pb-16">
			<Card variant="filled" className="gap-4 rounded-2xl bg-neutral-900">
				<Heading>Wallet</Heading>
				<HStack className="items-center justify-between">
					<Text size="lg">Devnet Mode</Text>
					<Switch
						value={devnetMode}
						onToggle={toggleDevnetMode}
						trackColor={{ true: colors.amber["400"] }}
						thumbColor={colors.neutral["200"]}
					/>
				</HStack>
				<HStack className="items-center justify-between">
					<Text size="lg">Hide less than 1 MINA transactions</Text>
					<Switch
						value={hideTinyTransactions}
						onToggle={() => setHideTinyTransactions(!hideTinyTransactions)}
						trackColor={{ true: colors.amber["400"] }}
						thumbColor={colors.neutral["200"]}
					/>
				</HStack>
				{Platform.OS === "android" ? (
					<Button
						variant="outline"
						size="lg"
						className="rounded-full"
						onPress={changeAccountConnectivity}
					>
						<ButtonText>
							Change connectivity to{" "}
							{keyAgent?.connectivity === "usb" ? "Bluetooth" : "USB"}
						</ButtonText>
					</Button>
				) : null}
			</Card>
			<Card variant="filled" className="gap-4 rounded-2xl bg-neutral-900">
				<Heading>Security</Heading>
				<HStack className="items-center justify-between">
					<Text size="lg">Biometric authentication</Text>
					<Switch
						value={biometricsRequired}
						onToggle={() => setBiometricsRequired(!biometricsRequired)}
						trackColor={{ true: colors.amber["400"] }}
						thumbColor={colors.neutral["200"]}
					/>
				</HStack>
			</Card>
			<Card variant="filled" className="gap-4 rounded-2xl bg-neutral-900">
				<Heading>Danger Zone</Heading>
				<Text>Just be careful, ok?</Text>
				<Button
					variant="outline"
					size="lg"
					className="rounded-full border-red-400"
					onPress={onRemoveCurrentAccount}
				>
					<ButtonText className="text-red-400">
						Remove current account
					</ButtonText>
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="rounded-full border-red-400"
					onPress={onWipePallad}
				>
					<ButtonText className="text-red-400">Wipe Pallad</ButtonText>
				</Button>
			</Card>
			<HStack className="items-center gap-2">
				<Text className="text-center text-neutral-400">
					Version: {packageJson.version}
				</Text>
				<Text>|</Text>
				<Link
					href="https://pallad.co"
					target="_blank"
					className="text-neutral-400"
				>
					pallad.co
				</Link>
			</HStack>
		</ScrollView>
	);
};

export default SettingsRoute;
