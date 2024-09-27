import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import { truncateString } from "@/lib/utils";
import { useTransactionStore } from "@/store/transaction";

const SummaryRoute = () => {
	const { signTransaction } = useWallet();
	const unsignedTransaction = useTransactionStore((state) => state.transaction);
	const totalAmount = useTransactionStore((state) => state.getTotalAmount());

	const handleSignTransaction = async () => {
		try {
			const result = await signTransaction(unsignedTransaction);
			console.log(">>>RES", result);
		} catch (error) {
			console.error(">>>ERR", error);
		}
	};

	return (
		<SafeAreaView className="flex-1">
			<View className="flex flex-1 flex-col justify-between  p-4">
				<View className="gap-4 mt-10">
					<Text className="text-2xl">Check the details.</Text>
					<Text className="text-lg text-zinc-400">
						Please review and confirm if all the details are correct.
					</Text>
				</View>
				<VStack className="gap-4">
					<Card size="md" variant="filled" className="rounded-2xl gap-3">
						<Text className="text-zinc-400">To</Text>
						<HStack className="justify-between">
							<Text className="text-zinc-400">Address</Text>
							<Text className="text-white">
								{truncateString({
									value: unsignedTransaction.receiverAddress,
									endCharCount: 5,
									firstCharCount: 5,
								})}
							</Text>
						</HStack>
					</Card>
					<Card size="md" variant="filled" className="rounded-2xl gap-3">
						<HStack className="justify-between">
							<Text className="text-zinc-400">Network</Text>
							<Text className="text-white">Mina Mainnet</Text>
						</HStack>
						<HStack className="justify-between">
							<Text className="text-zinc-400">Amount</Text>
							<Text className="text-white">
								{unsignedTransaction.amount} MINA
							</Text>
						</HStack>
						<HStack className="justify-between">
							<Text className="text-zinc-400">Network fee</Text>
							<Text className="text-white">{unsignedTransaction.fee} MINA</Text>
						</HStack>
						<Divider />
						<HStack className="justify-between">
							<Text className="text-white">Total</Text>
							<Text className="text-white">{totalAmount} MINA</Text>
						</HStack>
					</Card>
				</VStack>
				<Button
					size="xl"
					className="rounded-full bg-brand"
					onPress={handleSignTransaction}
				>
					<ButtonText>Send {totalAmount} MINA</ButtonText>
				</Button>
			</View>
		</SafeAreaView>
	);
};

export default SummaryRoute;
