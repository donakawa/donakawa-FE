import Dona1 from "@/assets/images/home/dona_1.png";
import Dona2 from "@/assets/images/home/dona_2.png";
import Dona3 from "@/assets/images/home/dona_3.png";
import Dona4 from "@/assets/images/home/dona_4.png";
import Dona5 from "@/assets/images/mypage/dona_5.png";
import Dona6 from "@/assets/images/mypage/dona_6.png";
import DirtyIcon from "@/assets/images/home/dirty.svg";
import PawIcon from "@/assets/images/home/Union.svg";
import RibbonIcon from "@/assets/images/home/Union_2.svg";
import { characterStyles as styles } from "@/styles/home/Homecomponent.style";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
  const getDonaImage = () => {
    if (!hasBudget) return Dona1;
    if (percent <= 0.3) return Dona2;
    if (percent <= 0.6) return Dona3;
    if (percent <= 0.8) return Dona4;
    if (percent <= 1) return Dona5;
    return Dona6;
  };

  const getMessage = () => {
    if (!hasBudget) return "똥 쌌어요...";
    if (percent > 1) return "장난해?\n이러다가 거지가 되겠어";
    return `이번 달 ${spent.toLocaleString()}원을 참고\n홍콩 숙박비를 아꼈어요!`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{getMessage()}</Text>
          <View style={styles.tail} />
        </View>

        <Text style={styles.nameText}>프리더햄톨</Text>
      </View>

      <View style={styles.floorLine} />

        <View style={styles.bottomArea}>
          <View style={styles.trashWrap}>
            <DirtyIcon width={40} height={30} />
          </View>
        </View>

        <Image source={getDonaImage()} style={styles.donaImage} />

        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.hamOuterButton}>
            <View style={styles.hamHighlight} />
            <View style={styles.hamInnerButton}>
              <View style={styles.pawCircle}>
                <PawIcon width={22} height={22} />
              </View>
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.decorateOuterButton}>
          <View style={styles.decorateHighlight} />

          <View style={styles.decorateInnerButton}>
            <RibbonIcon width={24} height={24} />

            <Text style={styles.smallButtonText}>
              햄꾸
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}