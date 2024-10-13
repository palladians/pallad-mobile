import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useWallet } from "@/hooks/use-wallet";
import { Link } from "expo-router";

const COFFEE_LINK =
  "/send?receiver=B62qnVUL6A53E4ZaGd3qbTr6RCtEZYTu3kTijVrrquNpPo4d3MuJ3nb";

const IdRoute = () => {
  const { getWallet } = useWallet();
  const wallet = getWallet();
  return (
    <ScrollView contentContainerClassName="flex-grow p-4 gap-8 pb-16">
      <VStack className="items-center justify-center gap-4">
        <Avatar size="xl">
          <AvatarFallbackText>{wallet?.name}</AvatarFallbackText>
        </Avatar>
        <Text size="lg">{wallet?.name}</Text>
        <Button size="lg" className="rounded-full bg-brand" isDisabled>
          <ButtonText>Mint ID</ButtonText>
        </Button>
        <Text>Coming soon</Text>
      </VStack>
      <VStack className="gap-4">
        <Link href={COFFEE_LINK} asChild>
          <Button className="bg-neutral-900 rounded-full" size="lg">
            <ButtonText
              className="text-neutral-200
"
            >
              Buy us a coffee
            </ButtonText>
          </Button>
        </Link>
      </VStack>
    </ScrollView>
  );
};

export default IdRoute;
