import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useExplorer } from "@/hooks/use-explorer";
import { useTransaction } from "@/hooks/use-transaction";
import { truncateString } from "@/lib/utils";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowRightIcon } from "lucide-react-native";
import colors from "tailwindcss/colors";

const TransactionRoute = () => {
	const { hash } = useLocalSearchParams();
	const { data: transaction } = useTransaction({ hash: hash.toString() });
	const { getTxUrl } = useExplorer();
	const transactionData = [
		{
			label: "Type",
			value: transaction?.type,
		},
		{
			label: "Hash",
			value: truncateString({
				value: transaction?.hash ?? "",
				firstCharCount: 5,
				endCharCount: 5,
			}),
		},
		{
			label: "Date",
			value: dayjs(transaction?.timestamp).format("DD/MM/YYYY HH:mm"),
		},
		{
			label: "Amount",
			value: `${transaction?.amount} MINA`,
		},
		{
			label: "Fee",
			value: `${transaction?.fee} MINA`,
		},
		{
			label: "Total",
			value: `${(transaction?.amount ?? 0) + (transaction?.fee ?? 0)} MINA`,
			borderTop: true,
		},
	];
	const openInMinascan = async () => {
		if (transaction) {
			await WebBrowser.openBrowserAsync(getTxUrl(transaction.hash));
		}
	};
	return (
		<VStack className="flex flex-1 flex-col p-4 justify-between pb-8">
			<VStack className="flex flex-col gap-4">
				<Card
					variant="filled"
					className="rounded-2xl flex flex-row justify-between items-center"
				>
					<VStack>
						<Text className="text-sm text-gray-400">From</Text>
						<Text className="text-white">
							{truncateString({
								value: transaction?.sourceAddress ?? "",
								firstCharCount: 5,
								endCharCount: 5,
							})}
						</Text>
					</VStack>
					<View className="border border-gray-400 rounded-full w-12 h-12 justify-center items-center">
						<ArrowRightIcon color={colors.gray[400]} />
					</View>
					<VStack>
						<Text className="text-sm text-gray-400">To</Text>
						<Text className="text-white">
							{truncateString({
								value: transaction?.receiverAddress ?? "",
								firstCharCount: 5,
								endCharCount: 5,
							})}
						</Text>
					</VStack>
				</Card>
				<Card variant="filled" className="rounded-2xl flex flex-col gap-2">
					{transactionData.map(({ label, value, borderTop }) => (
						<HStack
							className={clsx(
								"items-center justify-between border-t",
								borderTop ? "border-gray-600 pt-2" : "border-transparent",
							)}
							key={label}
						>
							<Text className="text-sm text-gray-400">{label}</Text>
							<Text className="text-white capitalize">{value}</Text>
						</HStack>
					))}
				</Card>
				<FormControl>
					<FormControlLabel>
						<FormControlLabelText>Memo</FormControlLabelText>
					</FormControlLabel>
					<Textarea className="rounded-2xl">
						<TextareaInput
							value={transaction?.memo}
							className="text-white"
							readOnly
						/>
					</Textarea>
				</FormControl>
			</VStack>
			<VStack className="gap-2">
				<Button
					size="xl"
					className="rounded-full bg-brand"
					onPress={openInMinascan}
				>
					<ButtonText>View in Minascan</ButtonText>
				</Button>
				<Button size="xl" className="rounded-full" onPress={router.back}>
					<ButtonText>Close</ButtonText>
				</Button>
			</VStack>
		</VStack>
	);
};

export default TransactionRoute;
