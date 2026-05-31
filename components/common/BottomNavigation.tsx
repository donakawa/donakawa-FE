import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 16 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
        const config = TAB_CONFIG[route.name];

        if (!config) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
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
