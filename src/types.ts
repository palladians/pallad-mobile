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
