import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NetworkMode = "mainnet" | "testnet";

type KeyAgentType = "hw";

export type Vendor = "ledger";

export type Connectivity = "usb" | "ble";

type KeyAgentBase = {
	id: string;
	publicKey: string;
	name: string;
};

type KeyAgentLedger = KeyAgentBase & {
	type: KeyAgentType;
	vendor: Vendor;
	connectivity: Connectivity;
	derivationPath: string;
};

type KeyAgent = KeyAgentLedger;

type VaultStateValue = "uninitialized" | "initialized";

type Contact = {
	name: string;
	address: string;
};

type VaultState = {
	state: VaultStateValue;
	currentKeyAgentId: string | undefined;
	keyAgents: KeyAgent[];
	networkMode: NetworkMode;
	contacts: Contact[];
};

type VaultCommands = {
	addKeyAgent: (keyAgent: KeyAgent) => void;
	getKeyAgent: (id: string) => KeyAgent | undefined;
	removeKeyAgent: (id: string) => void;
	setState: (state: VaultStateValue) => void;
	setCurrentKeyAgentId: (id: string) => void;
	getCurrentKeyAgent: () => KeyAgent | undefined;
	setNetworkMode: (network: NetworkMode) => void;
	addContact: (contact: Contact) => void;
	removeContact: (address: string) => void;
};

type VaultStore = VaultState & VaultCommands;

const initialState: VaultState = {
	state: "uninitialized",
	currentKeyAgentId: undefined,
	keyAgents: [],
	networkMode: "mainnet",
	contacts: [],
};

export const useVault = create<VaultStore>()(
	persist(
		(set, get) => ({
			...initialState,
			addKeyAgent: (keyAgent) =>
				set((state) => ({
					keyAgents: [...state.keyAgents, keyAgent],
				})),
			getKeyAgent: (id) => get().keyAgents.find((agent) => agent.id === id),
			removeKeyAgent: (id) =>
				set((state) => ({
					keyAgents: state.keyAgents.filter((agent) => agent.id !== id),
				})),
			setState: (state) => set({ state }),
			setCurrentKeyAgentId: (id) => set({ currentKeyAgentId: id }),
			getCurrentKeyAgent: () => {
				const currentKeyAgentId = get().currentKeyAgentId;
				if (!currentKeyAgentId) return undefined;
				return get().getKeyAgent(currentKeyAgentId);
			},
			setNetworkMode: (networkMode) => set({ networkMode }),
			addContact: (contact) =>
				set((state) => ({ contacts: [...state.contacts, contact] })),
			removeContact: (address) =>
				set((state) => ({
					contacts: state.contacts.filter((c) => c.address !== address),
				})),
		}),
		{
			name: "pallad_vault",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
