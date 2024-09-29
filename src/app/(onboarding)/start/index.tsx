import StartIllustration from "@/assets/start.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Link } from "expo-router";

const StartRoute = () => {
	return (
		<View className="flex flex-1 flex-col justify-between items-center">
			<StartIllustration />
			<View className="flex flex-col gap-2 items-center w-full p-4">
				<Text className="text-2xl font-semibold text-center">
					Welcome to Pallad
				</Text>
				<Text className="text-center text-sm leading-5 text-zinc-500">
					By clicking Import Wallet, you agree <br />
					to the Terms of Service and Privacy Policy.
				</Text>
				<Link href="/import" asChild>
					<Button size="xl" className="w-full mt-4 rounded-full bg-brand">
						<ButtonText>Import Wallet</ButtonText>
					</Button>
				</Link>
			</View>
		</View>
	);
};

export default StartRoute;
