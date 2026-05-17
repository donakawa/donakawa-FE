import { goalButtonStyles as styles } from "@/styles/log/Goalcomponent.style";
import { Pressable, Text, View } from "react-native";

import ArrowIcon from "@/assets/images/log/arrow_mini.svg";

interface GoalButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export default function GoalButton({ title, icon, onPress }: GoalButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.inner}>
        {icon}
        <View style={styles.RightSection}>
          <Text style={styles.title}>{title}</Text>
          <ArrowIcon style={styles.arrow} />
        </View>
      </View>
    </Pressable>
  );
}
