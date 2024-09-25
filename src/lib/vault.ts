import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

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

type VaultState = {
  state: VaultStateValue;
  currentKeyAgentId: string | undefined;
  keyAgents: KeyAgent[];
};

type VaultCommands = {
  addKeyAgent: (keyAgent: KeyAgent) => void;
  getKeyAgent: (id: string) => KeyAgent | undefined;
  removeKeyAgent: (id: string) => void;
  setState: (state: VaultStateValue) => void;
  setCurrentKeyAgentId: (id: string) => void;
};

type VaultStore = VaultState & VaultCommands;

const initialState: VaultState = {
  state: "uninitialized",
  currentKeyAgentId: undefined,
  keyAgents: [],
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
    }),
    {
      name: "pallad_vault",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
