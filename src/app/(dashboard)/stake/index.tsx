import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { type Message, useInbox } from "@/hooks/use-inbox";
import { useWallet } from "@/hooks/use-wallet";
import { constructDelegateeUrl } from "@/lib/archive";
import { fetcher } from "@/lib/utils";
import { Link } from "expo-router";
import BigDecimal from "js-big-decimal";
import { sum } from "rambda";
import useSWR from "swr";

const StakeRoute = () => {
	const { accountInfo, network, getWallet } = useWallet();
	const { inbox } = useInbox();
	const wallet = getWallet();
	const { data: delegatee } = useSWR(
		[
			constructDelegateeUrl({
				publicKey: wallet?.publicKey ?? "",
				network: network === "mainnet" ? "mainnet" : "devnet",
			}),
			network,
		],
		([url]) => fetcher(url),
	);
	const { data: epochInfo } = useSWR(
		"https://analytics.minascan.io/api/widgets/get-info",
		fetcher,
	);
	const epochSlots = new BigDecimal(7140);
	const epochHours = new BigDecimal(357);
	const timeLeft = new BigDecimal(epochInfo?.slot)
		.divide(epochSlots)
		.multiply(epochHours)
		.round()
		.getPrettyValue();
	const delegating = !!delegatee?.delegateePK;
	const rewards = Object.values(
		(inbox.find(
			(participantMessages) =>
				participantMessages.participantAddress === delegatee?.delegateePK,
		)?.messages as Record<string, Message[]>) ?? {},
	)
		.flat()
		.filter((message) => message.sender !== "me");
	const lastReward = rewards?.[rewards?.length - 1];
	const lastRewardPretty = new BigDecimal(lastReward?.amount)
		.round(2)
		.getPrettyValue();
	const totalRewards = sum(rewards?.map((reward) => reward.amount));
	const totalRewardsPretty = new BigDecimal(totalRewards)
		.round(2)
		.getPrettyValue();
	const micro = new BigDecimal("1000000000");
	const balance = new BigDecimal(accountInfo?.balance)
		.divide(micro)
		.round(2)
		.getPrettyValue();
	return (
		<ScrollView contentContainerClassName="flex-grow p-4 gap-8">
			<VStack className="gap-4">
				<Heading>Network info</Heading>
				<Card
					className="gap-2 rounded-2xl border-neutral-600"
					variant="outline"
				>
					<HStack className="justify-between">
						<Text className="text-neutral-400 text-lg">Current epoch</Text>
						<Text
							className="text-neutral-200 text-lg
"
						>
							{epochInfo?.globalEpochCount}
						</Text>
					</HStack>
					<HStack className="justify-between">
						<Text className="text-neutral-400 text-lg">Epoch end</Text>
						<Text
							className="text-neutral-200 text-lg
"
						>
							{timeLeft}h
						</Text>
					</HStack>
					<HStack className="justify-between">
						<Text className="text-neutral-400 text-lg">Current slot</Text>
						<Text
							className="text-neutral-200 text-lg
"
						>
							{epochInfo?.slot ?? 0}/7140
						</Text>
					</HStack>
				</Card>
			</VStack>
			{delegating ? (
				<VStack className="gap-4">
					<HStack className="items-center justify-between">
						<Heading>Delegating to</Heading>
						<Link href="/send?txType=4" asChild>
							<Button className="bg-brand rounded-full">
								<ButtonText>Change</ButtonText>
							</Button>
						</Link>
					</HStack>
					<Card className="gap-2 rounded-2xl bg-neutral-800">
						<HStack className="items-center gap-2">
							<Avatar size="sm">
								<AvatarImage source={{ uri: delegatee?.delegateeImg }} />
								<AvatarFallbackText>
									{delegatee?.delegateeName ?? delegatee?.delegateePK}
								</AvatarFallbackText>
							</Avatar>
							<Text size="2xl" className="text-neutral-200">
								{delegatee?.delegateeName ?? delegatee?.delegateePK}
							</Text>
						</HStack>
						<HStack className="justify-between">
							<Text className="text-neutral-400 text-lg">Total rewards</Text>
							<Text
								className="text-neutral-200 text-lg
"
							>
								{totalRewardsPretty} MINA
							</Text>
						</HStack>
						<HStack className="justify-between">
							<Text className="text-neutral-400 text-lg">Last reward</Text>
							<Text
								className="text-neutral-200 text-lg
"
							>
								{lastRewardPretty} MINA
							</Text>
						</HStack>
						<HStack className="justify-between">
							<Text className="text-neutral-400 text-lg">Total staked</Text>
							<Text
								className="text-neutral-200 text-lg
"
							>
								{balance} MINA
							</Text>
						</HStack>
					</Card>
				</VStack>
			) : (
				<VStack className="flex-1">
					<View className="flex-1" />
					<Link href="/send?txType=4" asChild>
						<Button size="xl" className="bg-brand rounded-full">
							<ButtonText>Start Staking</ButtonText>
						</Button>
					</Link>
				</VStack>
			)}
		</ScrollView>
	);
};

export default StakeRoute;
