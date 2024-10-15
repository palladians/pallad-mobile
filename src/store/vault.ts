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

export type Contact = {
	name: string;
	address: string;
};

type VaultState = {
	state: VaultStateValue;
	currentKeyAgentId: string | undefined;
	keyAgents: KeyAgent[];
	networkMode: NetworkMode;
	contacts: Contact[];
	biometricsRequired: boolean;
	hideTinyTransactions: boolean;
};

type VaultCommands = {
	addKeyAgent: (keyAgent: KeyAgent) => void;
	getKeyAgent: (id: string) => KeyAgent | undefined;
	removeKeyAgent: (id: string) => void;
	removeCurrentKeyAgent: () => void;
	setState: (state: VaultStateValue) => void;
	setCurrentKeyAgentId: (id: string | undefined) => void;
	getCurrentKeyAgent: () => KeyAgent | undefined;
	setNetworkMode: (network: NetworkMode) => void;
	addContact: (contact: Contact) => void;
	removeContact: (address: string) => void;
	setBiometricsRequired: (required: boolean) => void;
	setHideTinyTransactions: (hideTinyTransactions: boolean) => void;
	setConnectivity: (connectivity: Connectivity) => void;
	reset: () => void;
};

export type VaultStore = VaultState & VaultCommands;

const initialState: VaultState = {
	state: "uninitialized",
	currentKeyAgentId: undefined,
	keyAgents: [],
	networkMode: "mainnet",
	contacts: [],
	biometricsRequired: false,
	hideTinyTransactions: false,
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
			removeCurrentKeyAgent: () => {
				const { currentKeyAgentId, removeKeyAgent, setCurrentKeyAgentId } =
					get();
				if (!currentKeyAgentId) return;
				removeKeyAgent(currentKeyAgentId);
				const keyAgents = get().keyAgents;
				const keyAgentCount = keyAgents.length;
				if (keyAgentCount > 0) {
					setCurrentKeyAgentId(keyAgents[0].id);
				} else {
					setCurrentKeyAgentId(undefined);
				}
				return keyAgentCount;
			},
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
			setBiometricsRequired: (biometricsRequired) =>
				set({ biometricsRequired }),
			setHideTinyTransactions: (hideTinyTransactions) =>
				set({ hideTinyTransactions }),
			setConnectivity: (connectivity) => {
				const currentKeyAgent = get().getCurrentKeyAgent();
				if (!currentKeyAgent) return;
				return set((state) => ({
					keyAgents: state.keyAgents.map((agent) =>
						agent.id === currentKeyAgent.id
							? { ...agent, connectivity }
							: agent,
					),
				}));
			},
			reset: () => {
				return set(initialState);
			},
		}),
		{
			name: "pallad_vault",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
