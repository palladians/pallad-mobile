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

export type ScamData = {
	scamId: null;
	objectType: null;
	onchainId: null;
	defaultSecurityMessage: null;
	securityMessage: null;
	scamType: null;
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
	sourceScam: ScamData;
	receiverScam: ScamData;
};

export type ExternalDetailedTransactionData = {
	hash: string;
	type: "payment" | "delegation";
	amount: number;
	receivedAmount: number;
	receivedDelegationAmount: number;
	amountUsd: number;
	receivedAmountUsd: number;
	fee: number;
	feeUsd: number;
	sourceAddress: string;
	sourceName: string;
	sourceImg: string;
	isZkAppAccountSource: boolean;
	receiverAddress: string;
	receiverName: null | string;
	receiverImg: null | string;
	isZkAppAccountReceiver: boolean;
	memo: string;
	nonce: number;
	delegationAmount: null | number;
	delegationAmountUsd: null | number;
	alert: null | string;
	sequenceNumber: number;
	failureReason: null | string;
	timestamp: number;
	epoch: number;
	sourceScam: ScamData;
	receiverScam: ScamData;
};
