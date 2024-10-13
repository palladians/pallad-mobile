import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Link, Stack } from "expo-router";
import { SettingsIcon } from "lucide-react-native";
import colors from "tailwindcss/colors";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerShadowVisible: false,
        headerTintColor: colors.neutral[200],
        headerBackTitleStyle: {
          fontFamily: "DMSans_700Bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "ID",
          headerRight: () => (
            <Link href="/id/settings" asChild>
              <Button variant="link" size="lg">
                <ButtonIcon
                  as={SettingsIcon}
                  width={24}
                  height={24}
                  color={colors.neutral[200]}
                />
              </Button>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  );
};

export default Layout;
