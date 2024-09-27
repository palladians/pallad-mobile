import "@web3modal/polyfills";
import { type Connectivity, type Vendor, useVault } from "@/store/vault";
import type { Transaction } from "@/types";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportBluetooth from "@ledgerhq/react-native-hw-transport-ble";
import { MinaLedgerJS, Networks, TxType } from "mina-ledger-js";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";

type importWalletProps = {
	name: string;
	addressIndex: number;
	vendor: Vendor;
	connectivity: Connectivity;
};

export const useWallet = () => {
	const addKeyAgent = useVault((state) => state.addKeyAgent);
	const removeKeyAgent = useVault((state) => state.removeKeyAgent);
	const setState = useVault((state) => state.setState);
	const setCurrentKeyAgentId = useVault((state) => state.setCurrentKeyAgentId);
	const currentKeyAgent = useVault((state) => state.getCurrentKeyAgent());

	const _getNonce = async (publicKey: string) => {
		const req = await fetch("https://devnet.klesia.palladians.xyz/api", {
			method: "POST",
			body: JSON.stringify({
				method: "mina_getTransactionCount",
				params: [publicKey],
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const json = await req.json();
		return Number.parseInt(json.result);
	};

	const _getHwSdk = async ({
		vendor,
		connectivity,
	}: {
		vendor: Vendor;
		connectivity: Connectivity;
	}) => {
		return match(vendor)
			.with("ledger", () =>
				match(connectivity)
					.with("ble", async () => {
						const transport = await TransportBluetooth.create();
						return new MinaLedgerJS(transport as never);
					})
					.with("usb", async () => {
						const transport = await TransportWebHID.create();
						return new MinaLedgerJS(transport as never);
					})
					.exhaustive(),
			)
			.exhaustive();
	};

	const _getHwSdkForKeyAgent = async () => {
		if (!currentKeyAgent) throw new Error("No key agent found");
		return _getHwSdk({
			vendor: currentKeyAgent.vendor,
			connectivity: currentKeyAgent.connectivity,
		});
	};

	const importWallet = async ({
		name,
		addressIndex,
		vendor,
		connectivity,
	}: importWalletProps) => {
		const instance = await _getHwSdk({
			vendor,
			connectivity,
		});
		const wallet = await instance.getAddress(addressIndex);
		if (!wallet.publicKey) throw new Error("No public key found");
		const derivationPath = `m/44'/12586'/0'/0/${addressIndex}`;
		const walletId = nanoid();
		addKeyAgent({
			id: walletId,
			name,
			publicKey: wallet.publicKey,
			connectivity,
			derivationPath,
			type: "hw",
			vendor: "ledger",
		});
		setCurrentKeyAgentId(walletId);
		setState("initialized");
	};

	const getWallet = () => currentKeyAgent;

	const signTransaction = async (unsignedTransaction: Transaction) => {
		if (!currentKeyAgent) throw new Error("No key agent found");
		const wallet = await _getHwSdkForKeyAgent();
		const senderAccount = Number.parseInt(
			currentKeyAgent.derivationPath.split("/")[5],
		);
		const nonce = await _getNonce(currentKeyAgent.publicKey);
		const txBody = {
			...unsignedTransaction,
			amount: unsignedTransaction.amount * 1_000_000_000,
			fee: unsignedTransaction.fee * 1_000_000_000,
			networkId: Networks.DEVNET,
			senderAccount,
			senderAddress: currentKeyAgent.publicKey,
			nonce,
			txType: TxType.PAYMENT,
		};
		return wallet.signTransaction(txBody);
	};

	const removeWallet = async (id: string) => {
		removeKeyAgent(id);
		// TODO: Move to wallet choice or importing
	};

	return {
		importWallet,
		getWallet,
		removeWallet,
		signTransaction,
	};
};
