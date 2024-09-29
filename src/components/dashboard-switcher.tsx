import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import { View } from "@/components/ui/view";
import { truncateString } from "@/lib/utils";
import { Link } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetItem,
	ActionsheetItemText,
} from "./ui/actionsheet";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

export const DashboardSwitcher = () => {
	const [showActionsheet, setShowActionsheet] = useState(false);
	const handleClose = () => setShowActionsheet(false);
	return (
		<>
			<View className="flex flex-row gap-4 items-center">
				<Avatar size="sm">
					<AvatarFallbackText>Personal</AvatarFallbackText>
					<AvatarImage
						source={{
							uri: "https://products.ls.graphics/mesh-gradients/images/40.-Cherokee_1.jpg",
						}}
					/>
				</Avatar>
				<Button variant="link" onPress={() => setShowActionsheet(true)}>
					<ButtonText>mrcnk.pld</ButtonText>
					<ButtonIcon as={ChevronDownIcon} className="ml-2" />
				</Button>
			</View>
			<Actionsheet isOpen={showActionsheet} onClose={handleClose}>
				<ActionsheetBackdrop />
				<ActionsheetContent>
					<ActionsheetDragIndicatorWrapper>
						<ActionsheetDragIndicator />
					</ActionsheetDragIndicatorWrapper>
					<ActionsheetItem onPress={handleClose}>
						<ActionsheetItemText>Personal - mrcnk.pld</ActionsheetItemText>
					</ActionsheetItem>
					<ActionsheetItem onPress={handleClose}>
						<ActionsheetItemText>
							Treasury -&nbsp;
							{truncateString({
								firstCharCount: 5,
								endCharCount: 5,
								value:
									"B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
							})}
						</ActionsheetItemText>
					</ActionsheetItem>
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
