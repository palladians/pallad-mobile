import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Link, Redirect } from "expo-router";
import React from "react";
import { useVault } from "@/store/vault";

const devMode = process.env.EXPO_PUBLIC_DEV_MODE === "true";

const IndexRoute = () => {
	const currentKeyAgent = useVault((state) => state.getCurrentKeyAgent());

	if (!devMode && currentKeyAgent) {
		return <Redirect href="/home" />;
	}

	if (!devMode && !currentKeyAgent) {
		return <Redirect href="/start" />;
	}

	return (
		<VStack className="p-2 md:max-w-[440px] w-full" space="xl">
			<Link href="/start" asChild>
				<Button>
					<ButtonText>Start</ButtonText>
				</Button>
			</Link>
			<Link href="/import" asChild>
				<Button>
					<ButtonText>Import</ButtonText>
				</Button>
			</Link>
			<Link href="/home" asChild>
				<Button>
					<ButtonText>Home</ButtonText>
				</Button>
			</Link>
		</VStack>
	);
};

export default IndexRoute;
