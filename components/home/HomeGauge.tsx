import { gaugeStyles as styles } from "@/styles/home/Homecomponent.style";
import ForkIcon from "@/assets/images/home/fork.svg";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

interface HomeGaugeProps {
  hasBudget: boolean;
  budget: number;
  spent: number;
}

export default function HomeGauge({ hasBudget, budget, spent }: HomeGaugeProps) {
  const ratio = hasBudget ? Math.min(spent / budget, 1) : 0.12;

  const cx = 126;
  const cy = 126;
  const r = 117;

  const arcLength = Math.PI * r;
  const progressLength = arcLength * ratio;

  const angle = Math.PI - Math.PI * ratio;
  const knobX = cx + r * Math.cos(angle);
  const knobY = cy - r * Math.sin(angle);

  const displaySpent = hasBudget ? `${spent.toLocaleString()}원` : "?????원";
  const displayBudget = hasBudget ? budget.toLocaleString() : "???";

  return (
    <View style={styles.container}>
      <Svg width={252} height={135} viewBox="0 0 252 135" style={styles.graph}>
        <Defs>
          <LinearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFDBEB" />
            <Stop offset="100%" stopColor="#E8F9C7" />
          </LinearGradient>
        </Defs>

        <Path
          d="M 9 126 A 117 117 0 0 1 243 126"
          stroke="#9CCCA0"
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />

        <Path
          d="M 9 126 A 117 117 0 0 1 243 126"
          stroke="#E8F9C7"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />

        <Path
          d="M 9 126 A 117 117 0 0 1 243 126"
          stroke="url(#gaugeGradient)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${progressLength} ${arcLength}`}
          strokeDashoffset={0}
        />

        <Circle
          cx={knobX}
          cy={knobY}
          r={9}
          fill="#9CCCA0"
          stroke="#FAFFF9"
          strokeWidth={1.2}
        />
      </Svg>

      <View style={styles.gaugeTextBox}>
        <View style={styles.spentRow}>
          <ForkIcon />
          <Text style={styles.spentText}>소비</Text>
          <Text style={styles.amountText}>{displaySpent}</Text>
        </View>

        <Text style={styles.budgetText}>예산 {displayBudget} 원 중 ···</Text>
      </View>
    </View>
  );
}