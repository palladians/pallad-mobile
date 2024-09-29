import { useExplorer } from "@/hooks/use-explorer";
import * as WebBrowser from "expo-web-browser";
import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetItem,
	ActionsheetItemText,
} from "./ui/actionsheet";

export type ChatMenuProps = {
	open: boolean;
	onClose: () => void;
	address: string;
};

export const ChatMenu = ({ open, onClose, address }: ChatMenuProps) => {
	const { getAccountUrl } = useExplorer();
	const openInMinascan = async () => {
		const url = getAccountUrl(address);
		await WebBrowser.openBrowserAsync(url);
		onClose();
	};
	return (
		<Actionsheet isOpen={open} onClose={onClose}>
			<ActionsheetBackdrop />
			<ActionsheetContent>
				<ActionsheetDragIndicatorWrapper>
					<ActionsheetDragIndicator />
				</ActionsheetDragIndicatorWrapper>
				<ActionsheetItem onPress={openInMinascan}>
					<ActionsheetItemText>Open address in Minascan</ActionsheetItemText>
				</ActionsheetItem>
				<ActionsheetItem onPress={onClose}>
					<ActionsheetItemText>Add to contacts</ActionsheetItemText>
				</ActionsheetItem>
			</ActionsheetContent>
		</Actionsheet>
	);
};
