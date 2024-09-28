export type Transaction = {
	txType: number;
	amount: number;
	receiverAddress: string;
	fee: number;
	memo?: string;
};

export type TransactionWithNonce = Transaction & {
	nonce: number;
};

export type ExternalTransactionData = {
	senderAddress: string;
	senderName: string | null;
	senderImg: string | null;
	receiverAddress: string;
	receiverName: string | null;
	receiverImg: string | null;
	type: "payment" | "delegation";
	direction: "IN" | "OUT";
	account: string;
	accountName: string | null;
	accountImg: string | null;
	transactionHash: string;
	status: "Applied";
	age: number;
	amount: number;
	fee: number;
	block: number;
	stateHash: string;
	memo: string;
	alert: boolean;
	nonce: number;
	slot: number;
	globalSlot: number;
	sourceScam: {
		scamId: null;
		objectType: null;
		onchainId: null;
		defaultSecurityMessage: null;
		securityMessage: null;
		scamType: null;
	};
	receiverScam: {
		scamId: null;
		objectType: null;
		onchainId: null;
		defaultSecurityMessage: null;
		securityMessage: null;
		scamType: null;
	};
};
