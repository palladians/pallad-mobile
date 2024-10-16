import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useWallet } from "@/hooks/use-wallet";
import { truncateString } from "@/lib/utils";
import { useVault } from "@/store/vault";
import { Link } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import colors from "tailwindcss/colors";
import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetItem,
	ActionsheetItemText,
} from "./ui/actionsheet";
import { Pressable } from "./ui/pressable";

export const DashboardSwitcher = () => {
	const [showActionsheet, setShowActionsheet] = useState(false);
	const keyAgents = useVault((state) => state.keyAgents);
	const setCurrentKeyAgentId = useVault((state) => state.setCurrentKeyAgentId);
	const { getWallet } = useWallet();
	const wallet = getWallet();
	const handleClose = () => setShowActionsheet(false);
	const switchAccount = (keyAgentId: string) => {
		setCurrentKeyAgentId(keyAgentId);
		handleClose();
	};
	return (
		<>
			<Pressable
				onPress={() => setShowActionsheet(true)}
				className="flex flex-row gap-4 items-center py-2"
			>
				<Avatar size="sm">
					<AvatarFallbackText>{wallet?.name}</AvatarFallbackText>
				</Avatar>
				<Text>{wallet?.name}</Text>
				<ChevronDownIcon color={colors.neutral[200]} width={16} height={16} />
			</Pressable>
			<Actionsheet isOpen={showActionsheet} onClose={handleClose}>
				<ActionsheetBackdrop />
				<ActionsheetContent>
					<ActionsheetDragIndicatorWrapper>
						<ActionsheetDragIndicator />
					</ActionsheetDragIndicatorWrapper>
					{keyAgents.map((keyAgent) => (
						<ActionsheetItem
							key={keyAgent.id}
							onPress={() => switchAccount(keyAgent.id)}
						>
							<ActionsheetItemText>
								{keyAgent.name} -{" "}
								{truncateString({
									value: keyAgent.publicKey,
									firstCharCount: 5,
									endCharCount: 5,
								})}
							</ActionsheetItemText>
						</ActionsheetItem>
					))}
					<Link href="/import" asChild>
						<ActionsheetItem onPress={handleClose}>
							<ActionsheetItemText>Import Wallet</ActionsheetItemText>
						</ActionsheetItem>
					</Link>
				</ActionsheetContent>
			</Actionsheet>
		</>
	);
};
