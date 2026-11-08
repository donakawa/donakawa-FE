import { useMe } from "@/api/auth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

// 앱 진입 시 세션(쿠키 또는 저장된 소셜 토큰)이 살아 있으면 로그인 화면을 건너뜀
export default function Index() {
  const { data: me, isPending } = useMe();

  if (isPending) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#9CCCA0" />
      </View>
    );
  }

  return <Redirect href={me ? "/(tabs)" : "/login"} />;
}
