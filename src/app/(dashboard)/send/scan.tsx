import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import {
	type BarcodeScanningResult,
	CameraView,
	useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";

const ScanRoute = () => {
	const router = useRouter();
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);

	const onScanned = ({ data, type }: BarcodeScanningResult) => {
		if (type !== "qr") return;
		setScanned(true);
		CameraView.dismissScanner();
		router.replace(`/send?receiver=${data}`);
	};

	if (!permission) {
		return <View className="flex-1 bg-black" />;
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 p-4">
				<Text>We need your permission to show the camera</Text>
				<Button onPress={requestPermission} size="lg">
					<ButtonText>Allow Camera Access</ButtonText>
				</Button>
			</View>
		);
	}

	if (scanned) {
		return <View className="flex-1 bg-black" />;
	}

	return (
		<VStack className="flex-1 p-4 gap-8">
			<CameraView
				facing="back"
				style={{ flex: 1, borderRadius: 24, overflow: "hidden" }}
				onBarcodeScanned={onScanned}
				barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
			/>
			<VStack className="gap-4">
				<Button
					size="lg"
					className="rounded-full bg-neutral-800"
					onPress={router.back}
				>
					<ButtonText
						className="text-neutral-200
"
					>
						Close
					</ButtonText>
				</Button>
			</VStack>
		</VStack>
	);
};

export default ScanRoute;
