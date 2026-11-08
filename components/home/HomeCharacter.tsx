import DirtyIcon from "@/assets/images/home/dirty.svg";
import PawIcon from "@/assets/images/home/Union.svg";
import RibbonIcon from "@/assets/images/home/Union_2.svg";
import { useMe } from "@/api/auth";
import { useCharacterComment } from "@/api/character";
import HamkkuAccessory from "@/components/home/HamkkuAccessory";
import { useHamkkuAppearance } from "@/components/home/hamkkuAppearance";
import DonaCharacter from "@/components/home/DonaCharacter";
import { type DonaExpression } from "@/constants/dona";
import { characterStyles as styles } from "@/styles/home/Homecomponent.style";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

// styles.donaWrap의 width/height와 같아야 함
const DONA_SIZE = 120;

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
  // 햄꾸 닉네임은 회원 닉네임과 동일
  const { data: me } = useMe();
  const hamkkuNickname = me?.nickname ?? "";
  const {
    skin: appliedSkin,
    accessory: appliedAccessory,
    wall: appliedWall,
    floor: appliedFloor,
  } = useHamkkuAppearance();
  const { data: comment } = useCharacterComment();

  const getDonaExpression = (): DonaExpression => {
    if (!hasBudget) return 5;
    if (percent > 0.5) return 4;
    return 1;
  };


  const renderMessage = () => {
    if (comment?.message) {
      return <Text style={styles.speechText}>{comment.message}</Text>;
    }

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
        {/* TODO: pooCount(useCharacter) 연동 및 똥 청소(useCleanPoo) 플로우는 UI 확정 후 연결 */}
        <View style={styles.trashWrap}>
          <DirtyIcon width={40} height={30} />
        </View>
      </View>

      <View style={styles.donaWrap}>
        <DonaCharacter
          skinVariant={appliedSkin?.skinVariant}
          expression={getDonaExpression()}
          size={DONA_SIZE}
        />
        <HamkkuAccessory item={appliedAccessory} size={DONA_SIZE} />
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
