import BottomNavigation from "@/components/common/BottomNavigation";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="log" options={{ title: "로그" }} />
      <Tabs.Screen name="wish" options={{ title: "위시" }} />
      <Tabs.Screen name="goal" options={{ href: null }} />
      <Tabs.Screen name="logCalendar" options={{ href: null }} />
      <Tabs.Screen name="attendance" options={{ href: null }} />
      <Tabs.Screen name="mypage" options={{ title: "마이" }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
