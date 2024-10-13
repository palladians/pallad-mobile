import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactionStore } from "@/store/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import {
	Link,
	router,
	useGlobalSearchParams,
	useLocalSearchParams,
} from "expo-router";
import BigDecimal from "js-big-decimal";
import { UserRoundSearchIcon } from "lucide-react-native";
import { useLayoutEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import colors from "tailwindcss/colors";
import { z } from "zod";

const FEES = [
	{
		label: "Slow",
		value: 0.01,
	},
	{
		label: "Normal",
		value: 0.1,
	},
	{
		label: "Fast",
		value: 0.2,
	},
];

const SendTransactionSchema = z.object({
	amount: z.coerce.number().min(0.01).optional(),
	recipient: z.string().length(55),
	fee: z.coerce.number().min(0.01),
	memo: z.string().optional(),
});

const SendRoute = () => {
	const [showMemo, setShowMemo] = useState(false);
	const setTransaction = useTransactionStore((state) => state.setTransaction);
	const { receiver, txType } = useGlobalSearchParams();
	const txTypeValue = Number.parseInt(txType?.toString() ?? "0");
	const { accountInfo } = useWallet();
	const { handleSubmit, watch, setValue, formState, control, getValues } =
		useForm({
			resolver: zodResolver(SendTransactionSchema),
			defaultValues: {
				amount: undefined as unknown as string,
				recipient: "",
				fee: 0.1,
				memo: "",
			},
		});
	const { field: amountField } = useController({ name: "amount", control });
	const { field: receipientField } = useController({
		name: "recipient",
		control,
	});
	const { field: memoField } = useController({ name: "memo", control });
	const feeWatcher = watch("fee");
	const onSubmit = handleSubmit((data) => {
		if (txTypeValue === 0 && !data.amount)
			throw new Error("Amount is required");
		if (!data.recipient) throw new Error("Recipient is required");
		setTransaction({
			amount: Number.parseFloat(data.amount),
			receiverAddress: data.recipient,
			fee: data.fee,
			memo: data.memo,
			txType: txTypeValue,
		});
		router.push("/send/summary");
	});
	useLayoutEffect(() => {
		const nextValue = receiver?.toString();
		if (!nextValue) {
			setValue("recipient", "");
			return;
		}
		setValue("recipient", nextValue);
	}, [receiver]);
	const setMaxAmount = () => {
		if (!accountInfo) return;
		const feeValue = new BigDecimal(getValues("fee"));
		const micro = new BigDecimal("1000000000");
		const amount = new BigDecimal(accountInfo.balance)
			.divide(micro)
			.subtract(feeValue)
			.round(2)
			.getValue();
		setValue("amount", amount);
	};
	return (
		<ScrollView contentContainerClassName="flex-grow p-4 gap-8 pb-8">
			<VStack className="flex-1 justify-center gap-16">
				{txTypeValue === 0 ? (
					<VStack className="justify-center items-center gap-4">
						<FormControl isInvalid={!!formState.errors.amount}>
							<Input
								className={clsx("flex h-16 w-64 rounded-2xl border-black", {
									"border-red-500": !!formState.errors.amount,
								})}
								isInvalid={!!formState.errors.amount}
							>
								<InputField
									type="text"
									keyboardType="numeric"
									placeholder="0.00"
									className="h-16 text-3xl w-40 text-neutral-200
"
									onBlur={amountField.onBlur}
									onChangeText={amountField.onChange}
									value={amountField.value}
									textAlign="right"
									placeholderTextColor={colors.neutral[400]}
									returnKeyType="done"
								/>
								<InputSlot className="flex-1">
									<Button variant="link" className="px-4" size="lg">
										<ButtonText className="text-3xl font-light">
											MINA
										</ButtonText>
									</Button>
								</InputSlot>
							</Input>
						</FormControl>
						<Button variant="link" onPress={setMaxAmount} size="lg">
							<ButtonText className="uppercase">Max</ButtonText>
						</Button>
					</VStack>
				) : null}
				<VStack className="gap-8 pb-16">
					<FormControl isInvalid={!!formState.errors.recipient}>
						<FormControlLabel>
							<FormControlLabelText>To</FormControlLabelText>
						</FormControlLabel>
						<Input
							size="lg"
							className={clsx(
								"rounded-2xl border-neutral-900 focus:border-neutral-600 h-16",
								{
									"border-red-500": !!formState.errors.recipient,
								},
							)}
							isInvalid={!!formState.errors.recipient}
						>
							<InputField
								type="text"
								placeholder="Recipient address"
								className="bg-neutral-900 h-16 py-4 text-neutral-200
"
								onBlur={receipientField.onBlur}
								onChangeText={receipientField.onChange}
								value={receipientField.value}
								placeholderTextColor={colors.neutral[400]}
								returnKeyType="done"
							/>
							<InputSlot className="bg-neutral-900">
								<Link href="/contacts" asChild>
									<Button variant="link" className="py-8 px-4 bg-neutral-900">
										<ButtonIcon
											as={UserRoundSearchIcon}
											width={24}
											height={24}
											color={colors.neutral[200]}
										/>
									</Button>
								</Link>
							</InputSlot>
						</Input>
					</FormControl>
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText>Transaction fee</FormControlLabelText>
						</FormControlLabel>
						<View className="flex flex-row gap-4">
							{FEES.map((fee) => {
								const active = fee.value === feeWatcher;
								return (
									<Pressable
										key={fee.value}
										className={clsx(
											"flex justify-center items-center flex-1 bg-neutral-900 rounded-2xl p-2 border gap-1",
											active && "border-neutral-600",
										)}
										onPress={() => setValue("fee", fee.value)}
									>
										<Text
											className="text-neutral-200
"
										>
											{fee.label}
										</Text>
										<Text className="text-neutral-400">{fee.value} MINA</Text>
									</Pressable>
								);
							})}
						</View>
					</FormControl>
					{showMemo ? (
						<FormControl>
							<FormControlLabel>
								<FormControlLabelText>Memo</FormControlLabelText>
							</FormControlLabel>
							<Input
								size="lg"
								className="rounded-2xl h-16 border-neutral-900 focus:border-neutral-600"
							>
								<InputField
									type="text"
									className="bg-neutral-900 text-neutral-200
"
									onBlur={memoField.onBlur}
									onChangeText={memoField.onChange}
									value={memoField.value}
									returnKeyType="done"
								/>
							</Input>
						</FormControl>
					) : (
						<Button variant="link" onPress={() => setShowMemo(true)} size="lg">
							<ButtonText>Add Memo</ButtonText>
						</Button>
					)}
				</VStack>
			</VStack>
			<Button size="xl" className="rounded-full bg-brand" onPress={onSubmit}>
				<ButtonText>Continue</ButtonText>
			</Button>
		</ScrollView>
	);
};

export default SendRoute;
