import IconBuy from "@/assets/icon-buy.svg";
import IconReceive from "@/assets/icon-receive.svg";
import IconSend from "@/assets/icon-send.svg";
import IconStaking from "@/assets/icon-staking.svg";
import MinaLogo from "@/assets/mina-logo.svg";
import { DashboardPressable } from "@/components/dashboard-pressable";
import { DashboardSwitcher } from "@/components/dashboard-switcher";
import { TokenTile } from "@/components/token-tile";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useWallet } from "@/hooks/use-wallet";

const HomeRoute = () => {
	const { getAccountInfo } = useWallet();
	const accountInfo = getAccountInfo();
	return (
		<ScrollView contentContainerClassName="flex-grow pt-8 pb-16">
			<View className="gap-8 p-4 border-b-2 border-neutral-700 pb-8">
				<DashboardSwitcher />
				<View className="gap-2">
					<Text className="font-dm-bold">Total Balance</Text>
					<View className="flex-row gap-2 items-end">
						<Text className="text-neutral-200 text-5xl py-1">
							{accountInfo.balanceFiat}
						</Text>
						<Text className="text-xl mb-3">USD</Text>
					</View>
				</View>
				<View className="flex flex-row justify-between gap-8">
					<DashboardPressable Icon={IconBuy} label="Buy" to="/buy" disabled />
					<DashboardPressable Icon={IconSend} label="Send" to="/send" />
					<DashboardPressable
						Icon={IconReceive}
						label="Receive"
						to="/home/receive"
					/>
					<DashboardPressable Icon={IconStaking} label="Stake" to="/stake" />
				</View>
			</View>
			<View className="p-4 gap-4">
				<Text className="text-xl font-dm-bold">Coins</Text>
				<TokenTile
					Icon={MinaLogo}
					amount={accountInfo.balance}
					fiatChange={accountInfo.fiatChange}
					fiatTicker="USD"
					fiatValue={accountInfo.balanceFiat}
					name="Mina"
					ticker="MINA"
				/>
			</View>
		</ScrollView>
	);
};

export default HomeRoute;
