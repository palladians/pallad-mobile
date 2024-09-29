import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import { useState } from "react";
import QRCode from "react-native-qrcode-svg";

const base64Logo =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xOThfMjQ2OTUpIj4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMiIgZmlsbD0iI0Y2QzE3NyIvPgo8cGF0aCBkPSJNOTAgMjE0QzkwIDIxMS43OTEgOTEuNzkwOSAyMTAgOTQgMjEwSDEzNkMxNDMuNzMyIDIxMCAxNTAgMjE2LjI2OCAxNTAgMjI0VjIyNkMxNTAgMjMzLjczMiAxNDMuNzMyIDI0MCAxMzYgMjQwSDEwNEM5Ni4yNjggMjQwIDkwIDIzMy43MzIgOTAgMjI2VjIxNFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDY0QzkwIDYxLjc5MDkgOTEuNzkwOSA2MCA5NCA2MEgxOTZDMjAzLjczMiA2MCAyMTAgNjYuMjY4IDIxMCA3NFY3NkMyMTAgODMuNzMyIDIwMy43MzIgOTAgMTk2IDkwSDEwNEM5Ni4yNjggOTAgOTAgODMuNzMyIDkwIDc2VjY0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMjEwIDk0QzIxMCA5MS43OTA5IDIxMS43OTEgOTAgMjE0IDkwSDIyNkMyMzMuNzMyIDkwIDI0MCA5Ni4yNjggMjQwIDEwNFYxMzZDMjQwIDE0My43MzIgMjMzLjczMiAxNTAgMjI2IDE1MEgyMjRDMjE2LjI2OCAxNTAgMjEwIDE0My43MzIgMjEwIDEzNlY5NFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTYwIDk0QzYwIDkxLjc5MDkgNjEuNzkwOSA5MCA2NCA5MEg3NkM4My43MzIgOTAgOTAgOTYuMjY4IDkwIDEwNFYxOTZDOTAgMjAzLjczMiA4My43MzIgMjEwIDc2IDIxMEg3NEM2Ni4yNjggMjEwIDYwIDIwMy43MzIgNjAgMTk2Vjk0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMTUwIDE1MEgxOTZDMjAzLjczMiAxNTAgMjEwIDE1Ni4yNjggMjEwIDE2NFYxNjZDMjEwIDE3My43MzIgMjAzLjczMiAxODAgMTk2IDE4MEgxNjRDMTU2LjI2OCAxODAgMTUwIDE3My43MzIgMTUwIDE2NlYxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgMTUwSDE5NUMxOTUgMTUwIDIwMSAxNTAgMjA1LjUgMTU0LjVDMjEwIDE1OSAyMTAgMTY1IDIxMCAxNjVWMTUwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMjEwIDE1MEwyMjUgMTUwQzIyNSAxNTAgMjE5IDE1MCAyMTQuNSAxNDUuNUMyMTAgMTQxIDIxMCAxMzUgMjEwIDEzNUwyMTAgMTUwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMjEwIDE1MEwyMTAgMTM1QzIxMCAxMzUgMjEwIDE0MSAyMDUuNSAxNDUuNUMyMDEgMTUwIDE5NSAxNTAgMTk1IDE1MEwyMTAgMTUwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgOTBINzVDNzUgOTAgODEgOTAgODUuNSA5NC41QzkwIDk5IDkwIDEwNSA5MCAxMDVWOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik05MCA5MEwxMDUgOTBDMTA1IDkwIDk5IDkwIDk0LjUgODUuNUM5MCA4MSA5MCA3NSA5MCA3NUw5MCA5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDkwTDkwIDEwNUM5MCAxMDUgOTAgOTkgOTQuNSA5NC41Qzk5IDkwIDEwNSA5MCAxMDUgOTBMOTAgOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTBIMTk1QzE5NSA5MCAyMDEgOTAgMjA1LjUgOTQuNUMyMTAgOTkgMjEwIDEwNSAyMTAgMTA1VjkwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMjEwIDkwTDIxMCA3NUMyMTAgNzUgMjEwIDgxIDIwNS41IDg1LjVDMjAxIDkwIDE5NSA5MCAxOTUgOTBMMjEwIDkwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNMjEwIDkwTDIxMCAxMDVDMjEwIDEwNSAyMTAgOTkgMjE0LjUgOTQuNUMyMTkgOTAgMjI1IDkwIDIyNSA5MEwyMTAgOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik05MCAyMTBMMTA1IDIxMEMxMDUgMjEwIDk5IDIxMCA5NC41IDIwNS41QzkwIDIwMSA5MCAxOTUgOTAgMTk1TDkwIDIxMFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDIxMEw5MCAxOTVDOTAgMTk1IDkwIDIwMSA4NS41IDIwNS41QzgxIDIxMCA3NSAyMTAgNzUgMjEwTDkwIDIxMFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDIxMEw5MCAyMjVDOTAgMjI1IDkwIDIxOSA5NC41IDIxNC41Qzk5IDIxMCAxMDUgMjEwIDEwNSAyMTBMOTAgMjEwWiIgZmlsbD0iIzI1MjMzQSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzE5OF8yNDY5NSI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiByeD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

const ReceiveRoute = () => {
	const [copied, setCopied] = useState(false);
	const { getWallet } = useWallet();
	const wallet = getWallet();

	const copyAddress = async () => {
		await Clipboard.setStringAsync(wallet?.publicKey ?? "");
		setCopied(true);
	};

	return (
		<View className="flex flex-1 flex-col justify-between items-center p-4 gap-4">
			<View />
			<VStack className="w-[256px] gap-4">
				<QRCode
					value={wallet?.publicKey}
					logo={{ uri: base64Logo }}
					logoSize={72}
					size={256}
					backgroundColor="#000000"
					color="#f6c177"
				/>
				<Card variant="filled" className="max-w-[256px] rounded-2xl">
					<Text className="text-white">Public Key</Text>
					<Text className="text-sm break-all">{wallet?.publicKey}</Text>
				</Card>
			</VStack>
			<VStack className="w-full gap-2 pb-4">
				<Button
					className="rounded-full bg-brand"
					size="xl"
					onPress={copyAddress}
				>
					<ButtonText>{copied ? "Copied" : "Copy Address"}</ButtonText>
				</Button>
				<Link href="/home" asChild>
					<Button className="rounded-full bg-zinc-800" size="xl">
						<ButtonText className="text-white">Close</ButtonText>
					</Button>
				</Link>
			</VStack>
		</View>
	);
};

export default ReceiveRoute;
