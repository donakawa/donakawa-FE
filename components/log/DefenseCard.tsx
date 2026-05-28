import StrokeText from "@/components/log/StrokeText";
import { defenseCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import ChickenIcon from "@/assets/images/log/chicken.svg";
import ClockIcon from "@/assets/images/log/clock.svg";
import CoffeeIcon from "@/assets/images/log/coffee.svg";
import ShieldIcon from "@/assets/images/log/shield.svg";
import UnionIcon from "@/assets/images/log/Union.svg";

export default function DefenseCard() {
  const [isOpen, setIsOpen] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    const nextValue = isOpen ? 0 : 1;

    setIsOpen((prev) => !prev);

    Animated.spring(flipAnim, {
      toValue: nextValue,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.flipContainer}>
        <Animated.View
          style={[
            styles.flipFace,
            {
              transform: [{ perspective: 900 }, { rotateY: frontRotateY }],
            },
          ]}
        >
          <LinearGradient
            colors={["#F0FFE5", "#FFF7E8", "#FFB6C14D", "#F0FFE5"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 3 }}
            style={styles.card}
          >
            <ShieldIcon style={styles.shieldImage} />

            <View style={styles.badgeWrap}>
              <UnionIcon style={styles.union} />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>방어한 지출</Text>
              </View>
            </View>

            <View style={styles.content}>
              <StrokeText
                text="456,123원"
                color="#7EC985"
                strokeColor="#fff"
                fontSize={22}
                strokeWidth={4}
              />

              <Text style={styles.description}>
                도나와 함께 10번의 지름신을 막아냄
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.flipFace,
            styles.flipBack,
            {
              transform: [{ perspective: 900 }, { rotateY: backRotateY }],
            },
          ]}
        >
          <LinearGradient
            colors={["#FFB6C14D", "#F0FFE5", "#F0FFE5"]}
            start={{ x: 0, y: -1 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.openCard]}
          >
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Last 3 Months...</Text>

              <View style={styles.detailAmountRow}>
                <Text style={styles.detailAmountLabel}>방어 지출</Text>

                <StrokeText
                  text="456,123원"
                  color="#7EC985"
                  strokeColor="#ffffff"
                  fontSize={16}
                  strokeWidth={4}
                />
              </View>
            </View>

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <CoffeeIcon style={styles.detailImage} />
                <Text style={styles.detailItem}>커피 91잔</Text>
              </View>

              <View style={styles.detailRow}>
                <ClockIcon style={styles.detailImage} />
                <Text style={styles.detailItem}>최저시급 44시간</Text>
              </View>

              <View style={styles.detailRow}>
                <ChickenIcon style={styles.detailImage} />
                <Text style={styles.detailItem}>치킨 18마리</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Pressable>
  );
}
