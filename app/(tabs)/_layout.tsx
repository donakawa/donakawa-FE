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
      {/* 아래 화면들은 BottomNavigation의 TAB_CONFIG에 없어서 탭 바에 그려지지 않음.
          href: null(hidden)로 숨기면 SDK 58부터 진입 즉시 첫 탭으로 리다이렉트되므로 쓰지 않음 */}
      <Tabs.Screen name="goal" />
      <Tabs.Screen name="logCalendar" />
      <Tabs.Screen name="attendance" />
      <Tabs.Screen name="hamkku" />
      <Tabs.Screen name="mypage" options={{ title: "마이" }} />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
