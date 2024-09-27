import type { Transaction } from "@/types";
import { create } from "zustand";

type TransactionState = {
	transaction: Transaction;
};

type TransactionCommands = {
	setTransaction: (tx: Transaction) => void;
	getTotalAmount: () => number;
	reset: () => void;
};

type TransactionStore = TransactionState & TransactionCommands;

const initialState: TransactionState = {
	transaction: {
		txType: 0x00,
		amount: 0,
		receiverAddress: "",
		fee: 0.01,
		memo: "",
	},
};

export const useTransactionStore = create<TransactionStore>((set, get) => ({
	...initialState,
	setTransaction: (transaction) => set({ transaction }),
	getTotalAmount: () => {
		const { amount, fee } = get().transaction;
		return amount + fee;
	},
	reset: () => set(initialState),
}));
