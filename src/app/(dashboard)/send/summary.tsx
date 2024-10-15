import { SigningDrawer } from "@/components/signing-drawer";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import { truncateString } from "@/lib/utils";
import { useTransactionStore } from "@/store/transaction";
import type { SigningState } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

const SummaryRoute = () => {
	const router = useRouter();
	const [signingState, setSigningState] = useState<SigningState>("idle");
	const { signTransaction, network, sendTransaction } = useWallet();
	const unsignedTransaction = useTransactionStore((state) => state.transaction);
	const totalAmount = useTransactionStore((state) => state.getTotalAmount());
	const [signedTransactionHash, setSignedTransactionHash] = useState<string>();

	useEffect(() => {
		if (signingState !== "signing") return;
		let ignore = false;
		const signTx = async () => {
			try {
				const { input, rawSignarure } =
					await signTransaction(unsignedTransaction);
				if (ignore) return;
				if (!rawSignarure) {
					setSigningState("error");
					return;
				}
				const { hash } = await sendTransaction({
					input,
					rawSignature: rawSignarure,
					type: unsignedTransaction.txType === 0 ? "payment" : "delegation",
				});
				if (!hash) {
					throw new Error("Transaction submission failed");
				}
				setSignedTransactionHash(hash);
				setSigningState("signed");
			} catch (error) {
				console.error(error);
				setSigningState("error");
			}
		};
		signTx();
		return () => {
			ignore = true;
		};
	}, [signingState]);

	const onCancel = () => {
		setSigningState("idle");
	};

	const onStartOver = () => {
		setSigningState("idle");
		return router.replace("/send");
	};

	const onFinished = () => {
		setSigningState("idle");
		return router.replace("/inbox");
	};

	return (
		<ScrollView contentContainerClassName="flex-grow p-4 gap-8">
			<View className="gap-4 mt-8">
				<Text className="text-2xl">Check the details.</Text>
				<Text className="text-lg text-neutral-400">
					Please check and confirm that all the details are correct.
				</Text>
				<Text className="text-lg text-neutral-400">
					If the transaction looks good, unlock your Ledger, open the Mina app
					and click the "Send" button to sign the transaction.
				</Text>
			</View>
			<VStack className="flex-1 gap-4">
				<Card
					size="md"
					variant="filled"
					className="rounded-2xl gap-3 bg-neutral-900"
				>
					<Text className="text-neutral-400">To</Text>
					<HStack className="justify-between">
						<Text className="text-neutral-400">Address</Text>
						<Text
							className="text-neutral-200
"
						>
							{truncateString({
								value: unsignedTransaction.receiverAddress,
								endCharCount: 5,
								firstCharCount: 5,
							})}
						</Text>
					</HStack>
				</Card>
				<Card
					size="md"
					variant="filled"
					className="rounded-2xl gap-3 bg-neutral-900"
				>
					<HStack className="justify-between">
						<Text className="text-neutral-400">Network</Text>
						<HStack className="gap-1">
							<Text
								className="text-neutral-200
"
							>
								Mina
							</Text>
							<Text className="capitalize">{network}</Text>
						</HStack>
					</HStack>
					{unsignedTransaction.txType === 0 ? (
						<HStack className="justify-between">
							<Text className="text-neutral-400">Amount</Text>
							<Text
								className="text-neutral-200
"
							>
								{unsignedTransaction.amount} MINA
							</Text>
						</HStack>
					) : null}
					<HStack className="justify-between">
						<Text className="text-neutral-400">Network fee</Text>
						<Text
							className="text-neutral-200
"
						>
							{unsignedTransaction.fee} MINA
						</Text>
					</HStack>
					<Divider />
					<HStack className="justify-between">
						<Text
							className="text-neutral-200
"
						>
							Total
						</Text>
						<Text
							className="text-neutral-200
"
						>
							{totalAmount} MINA
						</Text>
					</HStack>
				</Card>
			</VStack>
			<Button
				size="xl"
				className="rounded-full bg-brand"
				onPress={() => setSigningState("signing")}
			>
				{unsignedTransaction.txType === 0 ? (
					<ButtonText>Send {totalAmount} MINA</ButtonText>
				) : (
					<ButtonText>Delegate Portfolio</ButtonText>
				)}
			</Button>
			{signingState !== "idle" ? (
				<SigningDrawer
					signingState={signingState}
					onCancel={onCancel}
					onStartOver={onStartOver}
					onFinished={onFinished}
					signedTransactionHash={signedTransactionHash}
				/>
			) : null}
		</ScrollView>
	);
};

export default SummaryRoute;
