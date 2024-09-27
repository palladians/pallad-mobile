import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useTransactionStore } from "@/store/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { router } from "expo-router";
import { UserRoundSearchIcon } from "lucide-react-native";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
} from "react-native";
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
	amount: z.coerce.number().min(0.01),
	recipient: z.string().length(55),
	fee: z.coerce.number().min(0.01),
	memo: z.string().optional(),
});

const SendRoute = () => {
	const [showMemo, setShowMemo] = useState(false);
	const setTransaction = useTransactionStore((state) => state.setTransaction);
	const { register, handleSubmit, watch, setValue, formState, control } =
		useForm({
			resolver: zodResolver(SendTransactionSchema),
			defaultValues: {
				amount: undefined,
				recipient: undefined,
				fee: 0.1,
				memo: "",
			},
		});
	const { field: amountField } = useController({ name: "amount", control });
	const { field: receipientField } = useController({
		name: "recipient",
		control,
	});
	const feeWatcher = watch("fee");
	const onSubmit = handleSubmit((data) => {
		if (!data.amount) throw new Error("Amount is required");
		if (!data.recipient) throw new Error("Recipient is required");
		setTransaction({
			amount: data.amount,
			receiverAddress: data.recipient,
			fee: data.fee,
			memo: data.memo,
			txType: 0x00,
		});
		router.push("/send/summary");
	});
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<SafeAreaView className="flex-1 p-4 z-10">
					<View className="flex flex-1 flex-col justify-between">
						<View className="justify-center items-center p-4 mt-10">
							<FormControl>
								<Input
									className="flex h-16 w-64 rounded-2xl"
									isInvalid={!!formState.errors.amount}
								>
									<InputField
										type="text"
										keyboardType="numeric"
										placeholder="0.00"
										className="h-16 text-3xl w-40"
										onBlur={amountField.onBlur}
										onChangeText={amountField.onChange}
										value={amountField.value}
									/>
									<InputSlot className="flex-1">
										<Button variant="link" className="px-4">
											<ButtonText className="text-3xl font-light">
												MINA
											</ButtonText>
										</Button>
									</InputSlot>
								</Input>
							</FormControl>
						</View>
						<VStack className="p-4 gap-8">
							<FormControl>
								<FormControlLabel>
									<FormControlLabelText>To</FormControlLabelText>
								</FormControlLabel>
								<Input
									size="lg"
									className="rounded-2xl border-zinc-900 h-16"
									isInvalid={!!formState.errors.recipient}
								>
									<InputField
										type="text"
										placeholder="Recipient address"
										className="bg-zinc-900 h-16 py-4"
										onBlur={receipientField.onBlur}
										onChangeText={receipientField.onChange}
										value={receipientField.value}
									/>
									<InputSlot className="bg-zinc-900">
										<Button variant="link" className="py-8 px-4 bg-zinc-900">
											<ButtonIcon
												as={UserRoundSearchIcon}
												width={24}
												height={24}
												color="#ffffff"
											/>
										</Button>
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
													"flex justify-center items-center flex-1 bg-zinc-900 rounded-2xl p-2 border gap-1",
													active && "border-zinc-400",
												)}
												onPress={() => setValue("fee", fee.value)}
											>
												<Text>{fee.label}</Text>
												<Text className="text-zinc-400">{fee.value} MINA</Text>
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
									<Input size="lg" className="rounded-2xl h-16 border-zinc-900">
										<InputField
											type="text"
											className="bg-zinc-900"
											{...register("memo")}
										/>
									</Input>
								</FormControl>
							) : (
								<Button variant="link" onPress={() => setShowMemo(true)}>
									<ButtonText>Add Memo</ButtonText>
								</Button>
							)}
						</VStack>
						<View className="p-4">
							<Button
								size="xl"
								className="rounded-full bg-brand"
								onPress={onSubmit}
							>
								<ButtonText>Continue</ButtonText>
							</Button>
						</View>
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default SendRoute;
