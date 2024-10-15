import "@web3modal/polyfills";
import { SendDelegationSchema, SendPaymentSchema } from "@/lib/validation";
import { type Connectivity, type Vendor, useVault } from "@/store/vault";
import type { NodePayment, Transaction } from "@/types";
import BigDecimal from "js-big-decimal";
import { MinaLedgerJS, Networks, TxType } from "mina-ledger-js";
import { nanoid } from "nanoid";
import { Platform } from "react-native";
import { match } from "ts-pattern";
import type { ZodSchema } from "zod";
import { useFiatPrice } from "./use-fiat-price";
import { klesiaFetcher, useKlesia } from "./use-klesia";

// Thx Auro
function _reEncodeRawSignature(rawSignature: string) {
	function shuffleBytes(hex: string) {
		const bytes = hex.match(/.{2}/g);
		if (!bytes) throw new Error("Invalid hex input");
		return bytes.reverse().join("");
	}
	if (rawSignature.length !== 128) {
		throw new Error("Invalid raw signature input");
	}
	const field = rawSignature.substring(0, 64);
	const scalar = rawSignature.substring(64);
	return shuffleBytes(field) + shuffleBytes(scalar);
}

const _getLedgerTransportLib = async ({
	connectivity,
}: {
	connectivity: Connectivity;
}) => {
	return match(Platform.OS)
		.with("web", () =>
			match(connectivity)
				.with("ble", () => import("@ledgerhq/hw-transport-web-ble"))
				.with("usb", () => import("@ledgerhq/hw-transport-webhid"))
				.exhaustive(),
		)
		.otherwise(() =>
			match(connectivity)
				.with("ble", () => import("@ledgerhq/react-native-hw-transport-ble"))
				.with("usb", () => import("@ledgerhq/react-native-hid"))
				.exhaustive(),
		);
};

const _createLedgerTransport = async ({
	connectivity,
}: {
	connectivity: Connectivity;
}) => {
	const Transport = await _getLedgerTransportLib({ connectivity });
	return Transport.default.create();
};

type ImportWalletProps = {
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
	const networkMode = useVault((state) => state.networkMode);
	const currentKeyAgent = useVault((state) => state.getCurrentKeyAgent());
	const network = networkMode === "mainnet" ? "mainnet" : "devnet";

	const { data: priceData } = useFiatPrice();

	const { data: accountData } = useKlesia<{
		result: { balance: string; nonce: string };
	}>({
		network,
		method: "mina_getAccount",
		params: [currentKeyAgent?.publicKey ?? ""],
	});

	const _getHwSdk = async ({
		vendor,
		connectivity,
	}: {
		vendor: Vendor;
		connectivity: Connectivity;
	}) => {
		return match(vendor)
			.with("ledger", async () => {
				const transport = await _createLedgerTransport({ connectivity });
				return new MinaLedgerJS(transport as never);
			})
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
	}: ImportWalletProps) => {
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

		const txBody = {
			fee: unsignedTransaction.fee * 1_000_000_000,
			networkId: network === "mainnet" ? Networks.MAINNET : Networks.DEVNET,
			senderAccount,
			senderAddress: currentKeyAgent.publicKey,
			nonce: Number.parseInt(accountData?.result.nonce ?? "0"),
			txType: unsignedTransaction.txType,
			receiverAddress: unsignedTransaction.receiverAddress,
			memo: unsignedTransaction.memo,
			amount: 0,
		};

		let schema: ZodSchema;
		if (unsignedTransaction.txType === 0) {
			txBody.amount = unsignedTransaction.amount * 1_000_000_000;
			schema = SendPaymentSchema;
		}
		if (unsignedTransaction.txType === 4) {
			schema = SendDelegationSchema;
		}

		const response = await wallet.signTransaction(txBody);
		const rawSignature = response?.signature;

		if (!rawSignature) throw new Error("No signature found");

		return {
			input: schema.parse({
				nonce: txBody.nonce,
				memo: txBody.memo,
				fee: txBody.fee,
				amount: txBody.amount,
				to: txBody.receiverAddress,
				from: txBody.senderAddress,
			}),
			rawSignarure: _reEncodeRawSignature(rawSignature),
		};
	};

	const sendTransaction = async ({
		input,
		rawSignature,
		type,
	}: {
		input: NodePayment;
		rawSignature: string;
		type: "payment" | "delegation";
	}) => {
		const payload = {
			input,
			signature: {
				rawSignature,
			},
		};
		let hash: string;
		try {
			const { result } = await klesiaFetcher({
				network,
				method: "mina_sendTransaction",
				params: [payload, type],
			});
			hash = result;
		} catch (error) {
			console.error(error);
			throw new Error("Failed to send transaction");
		}
		return {
			hash,
		};
	};

	const removeWallet = async (id: string) => {
		removeKeyAgent(id);
		// TODO: Move to wallet choice or importing
	};

	const getAccountInfo = () => {
		const microMina = new BigDecimal("1000000000");
		const minaBalance = new BigDecimal(
			accountData?.result.balance ?? "0",
		).divide(microMina);
		const minaToUsd = new BigDecimal(priceData?.["mina-protocol"]?.usd);
		const fiatChange = new BigDecimal(
			priceData?.["mina-protocol"]?.usd_24h_change ?? 0,
		)
			.round(2)
			.getPrettyValue();
		return {
			balance: minaBalance.round(2).getPrettyValue(),
			balanceFiat: minaBalance.multiply(minaToUsd).round(2).getPrettyValue(),
			nonce: BigInt(accountData?.result.nonce ?? "0"),
			fiatChange,
		};
	};

	return {
		importWallet,
		getWallet,
		removeWallet,
		signTransaction,
		sendTransaction,
		accountInfo: accountData?.result,
		getAccountInfo,
		network,
		networkMode,
	};
};
