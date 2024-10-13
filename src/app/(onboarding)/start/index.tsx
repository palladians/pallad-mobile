import StartIllustration from "@/assets/start.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Link } from "expo-router";

const StartRoute = () => {
	return (
		<ScrollView contentContainerClassName="flex-grow justify-between items-center">
			<StartIllustration height={600} width="100%" />
			<View className="flex-1 flex flex-col gap-2 items-center justify-end w-full p-4">
				<Text className="text-2xl font-semibold text-center text-neutral-200
">
					Welcome to Pallad
				</Text>
				<Text className="text-center text-sm leading-5 text-neutral-500">
					By clicking Import Wallet, you agree
					to the Terms of Service and Privacy Policy.
				</Text>
				<Link href="/import" asChild>
					<Button size="xl" className="w-full mt-4 rounded-full bg-brand">
						<ButtonText>Import Wallet</ButtonText>
					</Button>
				</Link>
			</View>
		</ScrollView>
	);
};

export default StartRoute;
