import type { SigningState } from "@/types";
import { useAssets } from "expo-asset";
import { CheckCircleIcon, XCircleIcon } from "lucide-react-native";
import { Image } from "react-native";
import colors from "tailwindcss/colors";
import { match } from "ts-pattern";
import { Button, ButtonText } from "./ui/button";
import {
	Drawer,
	DrawerBackdrop,
	DrawerContent,
	DrawerFooter,
} from "./ui/drawer";
import { Text } from "./ui/text";
import { View } from "./ui/view";
import { VStack } from "./ui/vstack";

export const SigningDrawer = ({
	signingState,
	onCancel,
	onStartOver,
	onFinished,
}: {
	signingState: Exclude<SigningState, "idle">;
	onCancel: () => void;
	onStartOver: () => void;
	onFinished: () => void;
	signedTransactionHash: string | undefined;
}) => {
	const [assets] = useAssets([require("assets/progress.gif")]);
	const title = match(signingState)
		.with("signing", () => "Signing Transaction")
		.with("error", () => "Signing Failed")
		.with("signed", () => "Transaction Signed")
		.exhaustive();
	const description = match(signingState)
		.with("signing", () => "Please sign the transaction on your Ledger.")
		.with(
			"error",
			() =>
				"An error occurred while signing the transaction. Make sure your Ledger is unlocked and the Mina app is opened.",
		)
		.with("signed", () => "Transaction signed and sent successfully.")
		.exhaustive();

	return (
		<Drawer
			isOpen={["signing", "signed", "error"].includes(signingState)}
			anchor="bottom"
			className="flex-1"
		>
			<DrawerBackdrop />
			<DrawerContent className="flex flex-col rounded-[32] h-[400] bg-neutral-900 justify-between items-center border-transparent shadow-2xl shadow-black">
				<VStack className="items-center gap-4">
					<Text size="2xl">{title}</Text>
					<Text size="lg" className="text-center">
						{description}
					</Text>
				</VStack>
				<View className="items-center w-full">
					{match(signingState)
						.with("signing", () => (
							<Image
								source={{ uri: assets?.[0].uri }}
								width={160}
								height={160}
							/>
						))
						.with("signed", () => (
							<CheckCircleIcon
								width={80}
								height={80}
								color={colors.cyan[300]}
							/>
						))
						.with("error", () => (
							<XCircleIcon width={80} height={80} color={colors.red[300]} />
						))
						.exhaustive()}
				</View>
				<DrawerFooter className="flex-col items-center justify-center w-full gap-2 h-[86]">
					{signingState === "error" ? (
						<Button
							size="lg"
							onPress={onStartOver}
							className="rounded-full br-brand w-full h-[40]"
						>
							<ButtonText className="text-black">Start Over</ButtonText>
						</Button>
					) : null}
					{signingState === "signed" ? (
						<Button
							size="lg"
							onPress={onFinished}
							className="rounded-full bg-brand w-full h-[40]"
						>
							<ButtonText className="text-black">View Inbox</ButtonText>
						</Button>
					) : null}
					{["error", "signing"].includes(signingState) ? (
						<Button
							size="lg"
							onPress={onCancel}
							className="rounded-full bg-neutral-800 w-full h-[40]"
						>
							<ButtonText
								className="text-neutral-200
"
							>
								Cancel
							</ButtonText>
						</Button>
					) : null}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
