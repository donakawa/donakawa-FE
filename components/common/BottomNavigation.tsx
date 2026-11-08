import type { BottomTabBarProps } from "expo-router/tabs";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ACTIVE_COLOR = "#0B4112";
const INACTIVE_COLOR = "#AAAFAB";

const TAB_CONFIG: Record<string, { label: string; icon: ImageSourcePropType }> = {
  index: { label: "홈", icon: require("@/assets/images/icons/home.png") },
  log: { label: "로그", icon: require("@/assets/images/icons/log.png") },
  wish: { label: "위시", icon: require("@/assets/images/icons/wish.png") },
  mypage: { label: "마이", icon: require("@/assets/images/icons/my.png") },
};

export default function BottomNavigation({
  state,
  emitter,
  navigateToTab,
}: BottomTabBarProps) {
  // 하단 안전 영역은 app/_layout.tsx의 SafeAreaView가 이미 비워주므로 여기서 더하지 않음
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const activeRoute = state.routes[state.index]?.name;
        const isFocused =
          state.index === index ||
          (route.name === "index" && activeRoute === "attendance");
        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
        const config = TAB_CONFIG[route.name];

        if (!config) return null;

        const onPress = () => {
          const event = emitter.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <Image
              source={config.icon}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
            <Text style={[styles.label, { color }]}>{config.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FBFBF5",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 37,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  icon: {
    width: 26,
    height: 26,
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
});
