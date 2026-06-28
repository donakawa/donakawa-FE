import DirtyIcon from "@/assets/images/home/dirty.svg";
import PawIcon from "@/assets/images/home/Union.svg";
import RibbonIcon from "@/assets/images/home/Union_2.svg";
import { getDonaSvg, type DonaExpression } from "@/constants/dona";
import { getHamkkuItem } from "@/constants/hamkku";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { characterStyles as styles } from "@/styles/home/Homecomponent.style";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeCharacterProps {
  hasBudget: boolean;
  spent: number;
  percent: number;
}

export default function HomeCharacter({
  hasBudget,
  spent,
  percent,
}: HomeCharacterProps) {
  const { appliedHamkku, hamkkuNickname } = useAttendanceStore();
  const appliedSkin = getHamkkuItem(appliedHamkku.skin);
  const appliedAccessory = getHamkkuItem(appliedHamkku.accessory);
  const appliedWall = getHamkkuItem(appliedHamkku.wall);
  const appliedFloor = getHamkkuItem(appliedHamkku.floor);
  const AppliedAccessorySvg = appliedAccessory?.Svg;

  const getDonaExpression = (): DonaExpression => {
    if (!hasBudget) return 5;
    if (percent > 0.5) return 4;
    return 1;
  };

  const DonaSvg = getDonaSvg(appliedSkin?.skinVariant, getDonaExpression());

  const renderAccessory = () => {
    if (!AppliedAccessorySvg) return null;

    return (
      <View style={styles.accessoryLayer}>
        <AppliedAccessorySvg width={34} height={34} />
      </View>
    );
  };

  const renderMessage = () => {
    if (!hasBudget) {
      return <Text style={styles.speechText}>똥 쌌어요...</Text>;
    }

    if (percent > 1) {
      return <Text style={styles.speechText}>{"망했어...\n이러다 거지가 되겠어"}</Text>;
    }

    return (
      <Text style={styles.speechText}>
        {"이번 달 "}
        <Text style={styles.speechTextHighlight}>{spent.toLocaleString()}원</Text>
        {" 썼어!\n예산 참고해서 아껴보자!"}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topArea, { backgroundColor: appliedWall?.color ?? "#F0FFE5" }]}>
        <View style={styles.speechBubble}>
          {renderMessage()}
          <View style={styles.tail} />
        </View>

        <Text style={styles.nameText}>{hamkkuNickname}</Text>
      </View>

      <View style={styles.floorLine} />

      <View style={[styles.bottomArea, { backgroundColor: appliedFloor?.color ?? "#E0F9BF" }]}>
        <View style={styles.trashWrap}>
          <DirtyIcon width={40} height={30} />
        </View>
      </View>

      <View style={styles.donaWrap}>
        <DonaSvg width={120} height={120} />
        {renderAccessory()}
      </View>

      <View style={styles.sideButtons}>
        <TouchableOpacity
          style={styles.hamOuterButton}
          onPress={() => router.push("/attendance")}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="출첵"
        >
          <View style={styles.hamHighlight} />
          <View style={styles.hamInnerButton}>
            <View style={styles.pawCircle}>
              <PawIcon width={22} height={22} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.decorateOuterButton}
          onPress={() => router.push("/(tabs)/hamkku")}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="햄꾸"
        >
          <View style={styles.decorateHighlight} />
          <View style={styles.decorateInnerButton}>
            <RibbonIcon width={24} height={24} />
            <Text style={styles.smallButtonText}>햄꾸</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
