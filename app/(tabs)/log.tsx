import { ScrollView, View } from "react-native";

import DefenseCard from "@/components/log/DefenseCard";
import ReceiptCard from "@/components/log/ReceiptCard";
import TopDayCard from "@/components/log/TopDayCard";
import ValueCard from "@/components/log/ValueCard";

export default function LogPage() {
  return (
    <ScrollView>
      <View style={{ gap: 28, paddingBottom: 40 }}>
        <ReceiptCard />
        <DefenseCard />
        <TopDayCard />
        <ValueCard />
      </View>
    </ScrollView>
  );
}
