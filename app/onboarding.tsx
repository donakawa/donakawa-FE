import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import InsetShadow from "@/components/common/InsetShadow";
import OnboardingArrowButton from "@/components/onboarding/OnboardingArrowButton";
import OnboardingPage from "@/components/onboarding/OnboardingPage";
import PageIndicator from "@/components/onboarding/PageIndicator";
import {
  ONBOARDING_PAGES,
  ONBOARDING_STORAGE_KEY,
  type OnboardingPageData,
} from "@/constants/onboarding";

const PAGE_MAX_WIDTH = 393;

export default function Onboarding() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = Math.min(windowWidth, PAGE_MAX_WIDTH);

  const listRef = useRef<FlatList<OnboardingPageData>>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const lastIndex = ONBOARDING_PAGES.length - 1;
  const isLastPage = pageIndex === lastIndex;

  const scrollToIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, lastIndex));

      setPageIndex(nextIndex);
      listRef.current?.scrollToOffset({
        offset: nextIndex * pageWidth,
        animated: true,
      });
    },
    [lastIndex, pageWidth],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      if (next !== pageIndex) setPageIndex(next);
    },
    [pageWidth, pageIndex],
  );

  const handleStart = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    router.replace("/login");
  }, [router]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={ONBOARDING_PAGES}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <OnboardingPage data={item} width={pageWidth} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: pageWidth,
          offset: pageWidth * index,
          index,
        })}
      />

      <View pointerEvents="box-none" style={styles.arrowsLayer}>
        <View style={styles.arrowSlot}>
          {pageIndex > 0 && (
            <OnboardingArrowButton
              direction="left"
              onPress={() => scrollToIndex(pageIndex - 1)}
            />
          )}
        </View>
        <View style={styles.arrowSlot}>
          {pageIndex < lastIndex && (
            <OnboardingArrowButton
              direction="right"
              onPress={() => scrollToIndex(pageIndex + 1)}
            />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <PageIndicator total={ONBOARDING_PAGES.length} current={pageIndex} />

        {isLastPage ? (
          <TouchableOpacity activeOpacity={0.8} onPress={handleStart} style={styles.startWrapper}>
            <InsetShadow style={styles.startActive}>
              <Text style={styles.startActiveLabel}>시작하기</Text>
            </InsetShadow>
          </TouchableOpacity>
        ) : (
          <View style={[styles.startWrapper, styles.startDisabled]}>
            <Text style={styles.startDisabledLabel}>시작하기</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
  },
  arrowsLayer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  arrowSlot: {
    width: 48,
    height: 48,
  },
  footer: {
    paddingHorizontal: 34,
    paddingBottom: 40,
    alignItems: "center",
    gap: 40,
  },
  startWrapper: {
    width: "100%",
    height: 48,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  startDisabled: {
    backgroundColor: "#DCE1DD",
    borderWidth: 1,
    borderColor: "#AAAFAB",
  },
  startDisabledLabel: {
    fontFamily: "Galmuri",
    fontSize: 16,
    lineHeight: 24,
    color: "#919692",
    textAlign: "center",
  },
  startActive: {
    width: "100%",
    height: 48,
    backgroundColor: "#F0FFE5",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    alignItems: "center",
    justifyContent: "center",
  },
  startActiveLabel: {
    fontFamily: "Galmuri",
    fontSize: 16,
    lineHeight: 24,
    color: "#2D322E",
    textAlign: "center",
  },
});
