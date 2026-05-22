import { Image, ImageSourcePropType, Text, View } from "react-native";

import { calendarItemCardStyles as styles } from "@/styles/log/LogCalendar.style";

type CalendarItemCardProps = {
  image: ImageSourcePropType;
  price: string;
  name: string;
  brand?: string;
};

export default function CalendarItemCard({
  image,
  price,
  name,
  brand,
}: CalendarItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftinfo}>
        <Image source={image} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.rightinfo}>
        {!!brand && <Text style={styles.brand}>{brand}</Text>}
      </View>
    </View>
  );
}
