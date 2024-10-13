import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import BigDecimal from "js-big-decimal";

const StakeRoute = () => {
  const { accountInfo } = useWallet();
  const micro = new BigDecimal("1000000000");
  const balance = new BigDecimal(accountInfo.balance)
    .divide(micro)
    .round(2)
    .getPrettyValue();
  return (
    <ScrollView contentContainerClassName="flex-grow p-4 gap-8">
      <VStack>
        <Heading>Delegating to</Heading>
        <Card className="gap-2">
          <HStack className="justify-between">
            <Text className="text-neutral-400 text-lg">Total rewards</Text>
            <Text
              className="text-neutral-200 text-lg
"
            >
              232 MINA
            </Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-neutral-400 text-lg">Last reward</Text>
            <Text
              className="text-neutral-200 text-lg
"
            >
              232 MINA
            </Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-neutral-400 text-lg">Total staked</Text>
            <Text
              className="text-neutral-200 text-lg
"
            >
              {balance} MINA
            </Text>
          </HStack>
        </Card>
      </VStack>
    </ScrollView>
  );
};

export default StakeRoute;
