import IconBuy from "@/assets/icon-buy.svg";
import IconReceive from "@/assets/icon-receive.svg";
import IconSend from "@/assets/icon-send.svg";
import IconStaking from "@/assets/icon-staking.svg";
import MinaLogo from "@/assets/mina-logo.svg";
import { DashboardPressable } from "@/components/dashboard-pressable";
import { DashboardSwitcher } from "@/components/dashboard-switcher";
import { TokenTile } from "@/components/token-tile";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

const HomeRoute = () => {
	return (
		<View>
			<View className="gap-8 p-4 border-b-2 border-zinc-700 pb-8">
				<DashboardSwitcher />
				<View className="gap-1">
					<Text>Total Balance</Text>
					<View className="flex-row gap-1 items-end">
						<Text className="text-zinc-100 text-5xl">18,057.60</Text>
						<Text className="text-xl">USD</Text>
					</View>
				</View>
				<View className="flex flex-row justify-between gap-8">
					<DashboardPressable Icon={IconBuy} label="Buy" to="/buy" />
					<DashboardPressable Icon={IconSend} label="Send" to="/send" />
					<DashboardPressable
						Icon={IconReceive}
						label="Receive"
						to="/home/receive"
					/>
					<DashboardPressable Icon={IconStaking} label="Stake" to="/staking" />
				</View>
			</View>
			<View className="p-4 gap-4">
				<Text className="text-xl font-semibold">Crypto</Text>
				<TokenTile
					Icon={MinaLogo}
					amount={258}
					fiatChange={-0.02}
					fiatTicker="USD"
					fiatValue={120}
					name="Mina"
					ticker="MINA"
				/>
			</View>
		</View>
	);
};

export default HomeRoute;
