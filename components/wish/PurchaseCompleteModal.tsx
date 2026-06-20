import {
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PurchaseCompleteImageSource = ImageSourcePropType | string;

interface PurchaseCompleteModalProps {
  visible: boolean;
  date: Date | null;
  image: PurchaseCompleteImageSource;
  itemName: string;
  price: string;
  onClose: () => void;
  onView: () => void;
}

const formatDateText = (date: Date | null) => {
  if (!date) return "";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 구매`;
};

const formatPrice = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const toImageSource = (source: PurchaseCompleteImageSource): ImageSourcePropType =>
  typeof source === "string" ? { uri: source } : source;

export default function PurchaseCompleteModal({
  visible,
  date,
  image,
  itemName,
  price,
  onClose,
  onView,
}: PurchaseCompleteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.content}>
            <View style={styles.summary}>
              <Text style={styles.title}>기록이 완료되었습니다!</Text>

              <View style={styles.itemCard}>
                <View style={styles.itemInner}>
                  <Text style={styles.dateText}>{formatDateText(date)}</Text>

                  <View style={styles.itemInfo}>
                    <Image source={toImageSource(image)} style={styles.itemImage} resizeMode="cover" />
                    <View style={styles.textInfo}>
                      <Text style={styles.priceText}>{formatPrice(price)}</Text>
                      <Text style={styles.nameText} numberOfLines={2}>
                        {itemName}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.cancelText}>확인</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewButton} onPress={onView} activeOpacity={0.85}>
                <Text style={styles.viewText}>보러가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.30)",
  },
  card: {
    width: 335,
    paddingHorizontal: 41,
    paddingVertical: 32,
    backgroundColor: "#FBFBF5",
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  content: {
    width: 252,
    alignItems: "center",
    gap: 24,
  },
  summary: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 20,
  },
  title: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#2D322E",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    lineHeight: 24,
  },
  itemCard: {
    width: 220,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFFF9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  itemInner: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#787D79",
    fontSize: 12,
    fontFamily: "WantedSansRegular",
    lineHeight: 18,
  },
  itemInfo: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 12,
  },
  itemImage: {
    width: 93,
    height: 93,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: "#AAAFAB",
  },
  textInfo: {
    alignSelf: "stretch",
  },
  priceText: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#2D322E",
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    lineHeight: 21,
  },
  nameText: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#787D79",
    fontSize: 12,
    fontFamily: "WantedSansRegular",
    lineHeight: 18,
  },
  buttonRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cancelButton: {
    width: 116,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  viewButton: {
    width: 116,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7EC985",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  cancelText: {
    textAlign: "center",
    color: "#464B47",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  viewText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
});
