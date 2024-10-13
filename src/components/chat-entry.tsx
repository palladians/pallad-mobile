import MinaBare from "@/assets/mina-bare.svg";
import type { Message } from "@/hooks/use-inbox";
import clsx from "clsx";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react-native";
import colors from "tailwindcss/colors";
import { match } from "ts-pattern";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { View } from "./ui/view";

const ChatPayment = ({ message }: { message: Message }) => {
	const outgoing = message.sender === "me";
	return (
		<Link
			href={`/inbox/transaction/${message.hash}`}
			onPress={Haptics.selectionAsync}
			asChild
		>
			<Pressable
				className={clsx(
					"flex flex-col gap-2 mx-4 border-2 p-4 rounded-2xl mb-2 bg-neutral-900",
					outgoing
						? "self-end items-end border-brand"
						: "items-start self-start border-neutral-600",
				)}
			>
				<HStack className="items-center gap-1">
					{outgoing ? (
						<ArrowLeftIcon
							color={colors.neutral["400"]}
							width={12}
							height={12}
						/>
					) : (
						<ArrowRightIcon
							color={colors.neutral["400"]}
							width={12}
							height={12}
						/>
					)}
					<Text className="text-neutral-400">
						{outgoing ? "Sent" : "Received"}
					</Text>
				</HStack>
				<HStack className="gap-2 items-center">
					<MinaBare width={16} height={16} />
					<Text className="text-neutral-200
 text-xl">
						{message.amount.toFixed(2)}
					</Text>
				</HStack>
			</Pressable>
		</Link>
	);
};

const ChatMessage = ({ message }: { message: Message }) => {
	const outgoing = message.sender === "me";
	return (
		<Link
			href={`/inbox/transaction/${message.hash}`}
			onPress={Haptics.selectionAsync}
			asChild
		>
			<Pressable
				className={clsx(
					"flex flex-col mx-4 gap-1 mb-2",
					outgoing ? "self-end items-end" : "items-start self-start",
				)}
			>
				<View
					className={clsx(
						"flex flex-row p-4 rounded-2xl",
						outgoing
							? "bg-brand rounded-br-none"
							: "bg-neutral-800 rounded-bl-none",
					)}
				>
					<Text className="text-neutral-200
">{message.content}</Text>
				</View>
				{message.type === "message" ? (
					<View className="flex flex-row items-center gap-1">
						{outgoing ? (
							<ArrowLeftIcon
								color={colors.neutral["400"]}
								width={12}
								height={12}
							/>
						) : (
							<ArrowRightIcon
								color={colors.neutral["400"]}
								width={12}
								height={12}
							/>
						)}
						<Text className="text-neutral-400">
							{message.amount.toFixed(2)} MINA
						</Text>
					</View>
				) : null}
			</Pressable>
		</Link>
	);
};

export const ChatEntry = ({ message }: { message: Message }) => {
	return match(message.type)
		.with("payment", () => <ChatPayment message={message} />)
		.with("message", () => <ChatMessage message={message} />)
		.exhaustive();
};
