import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import React from "react";
const index = () => {
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

export default index;
