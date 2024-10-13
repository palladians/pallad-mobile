import type { Transaction } from "@/types";
import { create } from "zustand";

type TransactionState = {
	transaction: Transaction;
	transactionSignature: string | undefined;
};

type TransactionCommands = {
	setTransaction: (tx: Transaction) => void;
	getTotalAmount: () => number;
	reset: () => void;
};

type TransactionStore = TransactionState & TransactionCommands;

const initialState: TransactionState = {
	transaction: {
		txType: 0,
		amount: 0,
		receiverAddress: "",
		fee: 0.01,
		memo: "",
	},
	transactionSignature: undefined,
};

export const useTransactionStore = create<TransactionStore>((set, get) => ({
	...initialState,
	setTransaction: (transaction) => set({ transaction }),
	getTotalAmount: () => {
		const { amount, fee, txType } = get().transaction;
		if (txType === 4) return fee;
		return amount + fee;
	},
	reset: () => set(initialState),
}));
