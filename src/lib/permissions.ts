import { PermissionsAndroid } from "react-native";

export const requestAndroidPermissions = async () => {
	const bluetoothScanPermission = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
		{
			title: "Location Permission",
			message: "Bluetooth Low Energy requires Location",
			buttonPositive: "OK",
		},
	);
	const bluetoothConnectPermission = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
		{
			title: "Location Permission",
			message: "Bluetooth Low Energy requires Location",
			buttonPositive: "OK",
		},
	);
	const fineLocationPermission = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		{
			title: "Location Permission",
			message: "Bluetooth Low Energy requires Location",
			buttonPositive: "OK",
		},
	);

	return (
		bluetoothScanPermission === "granted" &&
		bluetoothConnectPermission === "granted" &&
		fineLocationPermission === "granted"
	);
};
