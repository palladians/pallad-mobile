import { Button, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import {
	Modal,
	ModalBackdrop,
	ModalContent,
	ModalHeader,
} from "@/components/ui/modal";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import { requestAndroidPermissions } from "@/lib/permissions";
import type { Connectivity } from "@/store/vault";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { type BaseSyntheticEvent, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { z } from "zod";

const ImportingModal = ({ importing }: { importing: boolean }) => {
	return (
		<Modal isOpen={importing}>
			<ModalBackdrop />
			<ModalContent className="rounded-2xl">
				<ModalHeader className="justify-center w-full">
					<Heading className="text-center" size="xl">
						Import in progress
					</Heading>
				</ModalHeader>
				<VStack className="mt-4 gap-4 justify-center w-full">
					<Text className="text-center" size="lg">
						Wallet import in progress. It may take up to 1 minute.
					</Text>
					<Spinner size="large" />
				</VStack>
			</ModalContent>
		</Modal>
	);
};

const ImportWalletSchema = z.object({
	name: z.string(),
	addressIndex: z.string(),
});

const ImportRoute = () => {
	const [importing, setImporting] = useState(false);
	const [customizeDerivation, setCustomizeDerivation] = useState(false);
	const { importWallet } = useWallet();

	const { handleSubmit, control, getValues } = useForm({
		resolver: zodResolver(ImportWalletSchema),
		defaultValues: {
			name: "Personal",
			addressIndex: "0",
		},
	});

	const { field: nameField } = useController({ name: "name", control });
	const { field: addressIndexField } = useController({
		name: "addressIndex",
		control,
	});

	const importAndRedirect = async ({
		event,
		connectivity,
	}: {
		event: BaseSyntheticEvent;
		connectivity: Connectivity;
	}) => {
		return handleSubmit(async (data) => {
			setImporting(true);
			try {
				await requestAndroidPermissions();
				await importWallet({
					name: data.name,
					addressIndex: Number.parseInt(data.addressIndex),
					connectivity,
					vendor: "ledger",
				});
				router.navigate("/home");
			} catch (error: any) {
				Alert.alert("Error", error.message);
			} finally {
				setImporting(false);
			}
		})(event);
	};

	return (
		<ScrollView contentContainerClassName="flex-grow gap-8 p-4">
			<View className="flex flex-1 flex-col gap-8 w-full mt-8">
				<Text className="text-neutral-400">
					Import your wallet using your Ledger device. You'll be prompted to
					confirm your address. We support Nano S, Nano X, Flex, and Stax on
					Android and Nano X, Flex, and Stax on iOS.
				</Text>
				<FormControl>
					<FormControlLabel>
						<FormControlLabelText>Wallet Name</FormControlLabelText>
					</FormControlLabel>
					<Input className="rounded-full border-neutral-900 focus:border-neutral-600">
						<InputField
							placeholder="Set Wallet Name"
							className="text-neutral-200 bg-neutral-900
 placeholder:text-neutral-400"
							value={nameField.value}
							onChangeText={nameField.onChange}
							onBlur={nameField.onBlur}
						/>
					</Input>
				</FormControl>
				{customizeDerivation ? (
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText>Address Index</FormControlLabelText>
						</FormControlLabel>
						<Input className="rounded-full border-neutral-900 focus:border-neutral-600">
							<InputField
								type="text"
								keyboardType="numeric"
								placeholder="Curstom Address Index"
								className="text-neutral-200 bg-neutral-900
 placeholder:text-neutral-400"
								value={addressIndexField.value}
								onChangeText={addressIndexField.onChange}
								onBlur={addressIndexField.onBlur}
							/>
						</Input>
					</FormControl>
				) : (
					<Button
						onPress={() => setCustomizeDerivation(true)}
						variant="link"
						size="lg"
					>
						<ButtonText>Customize derivation path</ButtonText>
					</Button>
				)}
			</View>
			<View className="gap-2">
				<Button
					size="xl"
					className="rounded-full bg-brand"
					onPress={(event) => importAndRedirect({ event, connectivity: "ble" })}
				>
					<ButtonText>Import via Bluetooth</ButtonText>
				</Button>
				{Platform.OS === "android" ? (
					<Button
						action="secondary"
						size="xl"
						className="rounded-full bg-neutral-800 text-white"
						onPress={(event) =>
							importAndRedirect({ event, connectivity: "usb" })
						}
					>
						<ButtonText>Import via USB</ButtonText>
					</Button>
				) : null}
			</View>
			<ImportingModal importing={importing} />
		</ScrollView>
	);
};

export default ImportRoute;
