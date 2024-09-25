import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useForm } from "react-hook-form";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useWallet } from "@/hooks/use-wallet";
import type { Connectivity } from "@/lib/vault";
import { router } from "expo-router";
import { type BaseSyntheticEvent, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ImportWalletSchema = z.object({
  name: z.string(),
  addressIndex: z.coerce.number(),
});

const ImportRoute = () => {
  const [customizeDerivation, setCustomizeDerivation] = useState(false);
  const { importWallet } = useWallet();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ImportWalletSchema),
    defaultValues: {
      name: "Personal",
      addressIndex: 0,
    },
  });

  console.log(">>>FS", formState);

  const importAndRedirect = async ({
    event,
    connectivity,
  }: {
    event: BaseSyntheticEvent;
    connectivity: Connectivity;
  }) => {
    console.log(">>>FS", formState);
    return handleSubmit(async (data) => {
      console.log(">>>DAT", data);
      await importWallet({
        name: data.name,
        addressIndex: data.addressIndex,
        connectivity,
        vendor: "ledger",
      });
      router.navigate("/home");
    })(event);
  };

  return (
    <SafeAreaView className="flex flex-1 flex-col justify-between p-4">
      <View className="flex flex-col gap-8 w-full">
        <Text className="text-2xl font-semibold">Import Wallet</Text>
        <Text className="text-gray-400">
          Import your wallet using your Ledger device. You'll be prompted to
          confirm your address. We support Ledger Nano S, Ledger Nano X, Ledger
          Flex, and Ledger Stax.
        </Text>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Wallet Name</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField placeholder="Set Wallet Name" {...register("name")} />
          </Input>
        </FormControl>
        {customizeDerivation ? (
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Address Index</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                keyboardType="numeric"
                placeholder="Curstom Address Index"
                {...register("addressIndex")}
              />
            </Input>
          </FormControl>
        ) : (
          <Button onPress={() => setCustomizeDerivation(true)} variant="link">
            <ButtonText>Customize derivation path</ButtonText>
          </Button>
        )}
      </View>
      <View className="gap-2">
        <Button
          size="xl"
          className="rounded-full"
          onPress={(event) => importAndRedirect({ event, connectivity: "ble" })}
        >
          <ButtonText>Import with Bluetooth</ButtonText>
        </Button>
        <Button
          action="secondary"
          size="xl"
          className="rounded-full"
          onPress={(event) => importAndRedirect({ event, connectivity: "usb" })}
        >
          <ButtonText>Import with USB</ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ImportRoute;
