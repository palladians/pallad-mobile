import "@web3modal/polyfills";
import { match } from "ts-pattern";
import * as SecureStore from "expo-secure-store";
import { type Connectivity, type Vendor, useVault } from "@/lib/vault";
import TransportBluetooth from "@ledgerhq/react-native-hw-transport-ble";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { MinaLedgerJS } from "mina-ledger-js";
import { nanoid } from "nanoid";

type importWalletProps = {
  name: string;
  addressIndex: number;
  vendor: Vendor;
  connectivity: Connectivity;
};

export const useWallet = () => {
  const keyAgents = useVault((state) => state.keyAgents);
  const addKeyAgent = useVault((state) => state.addKeyAgent);
  const removeKeyAgent = useVault((state) => state.removeKeyAgent);
  const setState = useVault((state) => state.setState);
  const setCurrentKeyAgentId = useVault((state) => state.setCurrentKeyAgentId);

  const importWallet = async ({
    name,
    addressIndex,
    vendor,
    connectivity,
  }: importWalletProps) => {
    const wallet = await match(vendor)
      .with("ledger", () =>
        match(connectivity)
          .with("ble", async () => {
            const transport = await TransportBluetooth.create();
            const instance = new MinaLedgerJS(transport as never);
            return instance.getAddress(addressIndex);
          })
          .with("usb", async () => {
            const transport = await TransportWebHID.create();
            const instance = new MinaLedgerJS(transport as never);
            return instance.getAddress(addressIndex);
          })
          .exhaustive()
      )
      .exhaustive();
    console.log(">>>WALLET", wallet);
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

  const getWallet = async () => {
    const walletId = await SecureStore.getItemAsync("currentWalletId");
    if (!walletId) throw new Error("We have a problem");
    const keyAgent = keyAgents.find((keyAgent) => keyAgent.id === walletId);
    if (!keyAgent) throw new Error("We have a problem"); // TODO: Move to wallet choice or importing
    return keyAgent;
  };

  const removeWallet = async (id: string) => {
    removeKeyAgent(id);
    // TODO: Move to wallet choice or importing
  };

  return {
    importWallet,
    getWallet,
    removeWallet,
  };
};
