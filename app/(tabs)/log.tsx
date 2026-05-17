import { ScrollView, View } from "react-native";

import DefenseCard from "@/components/log/DefenseCard";
import ReceiptCard from "@/components/log/ReceiptCard";

export default function LogPage() {
  return (
    <ScrollView>
      <View style={{ gap: 28, paddingBottom: 40 }}>
        <ReceiptCard />
        <DefenseCard />
      </View>
    </ScrollView>
  );
}
