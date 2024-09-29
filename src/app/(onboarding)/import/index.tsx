import { Button, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useWallet } from "@/hooks/use-wallet";
import type { Connectivity } from "@/store/vault";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { type BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ImportWalletSchema = z.object({
	name: z.string(),
	addressIndex: z.coerce.number(),
});

const ImportRoute = () => {
	const [customizeDerivation, setCustomizeDerivation] = useState(false);
	const { importWallet } = useWallet();

	const { register, handleSubmit, formState } = useForm({
		resolver: zodResolver(ImportWalletSchema),
		defaultValues: {
			name: "Personal",
			addressIndex: 0,
		},
	});

	const importAndRedirect = async ({
		event,
		connectivity,
	}: {
		event: BaseSyntheticEvent;
		connectivity: Connectivity;
	}) => {
		return handleSubmit(async (data) => {
			await importWallet({
				name: data.name,
				addressIndex: data.addressIndex,
				connectivity,
				vendor: "ledger",
			});
			router.navigate("/home");
		})(event);
	};

	return (
		<View className="gap-4">
			<View className="flex flex-col gap-8 w-full">
				<Text className="text-2xl font-semibold">Import Wallet</Text>
				<Text className="text-zinc-400">
					Import your wallet using your Ledger device. You'll be prompted to
					confirm your address. We support Ledger Nano S, Ledger Nano X, Ledger
					Flex, and Ledger Stax.
				</Text>
				<FormControl>
					<FormControlLabel>
						<FormControlLabelText>Wallet Name</FormControlLabelText>
					</FormControlLabel>
					<Input>
						<InputField placeholder="Set Wallet Name" {...register("name")} />
					</Input>
				</FormControl>
				{customizeDerivation ? (
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText>Address Index</FormControlLabelText>
						</FormControlLabel>
						<Input>
							<InputField
								type="text"
								keyboardType="numeric"
								placeholder="Curstom Address Index"
								{...register("addressIndex")}
							/>
						</Input>
					</FormControl>
				) : (
					<Button onPress={() => setCustomizeDerivation(true)} variant="link">
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
				<Button
					action="secondary"
					size="xl"
					className="rounded-full"
					onPress={(event) => importAndRedirect({ event, connectivity: "usb" })}
				>
					<ButtonText>Import via USB</ButtonText>
				</Button>
			</View>
		</View>
	);
};

export default ImportRoute;
