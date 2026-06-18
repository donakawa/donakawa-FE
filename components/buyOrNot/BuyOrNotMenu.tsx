import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import SearchIcon from "@/assets/images/buyOrNot/search.svg";
import ArrowIcon from "@/assets/images/log/arrow_mini.svg";

import SimpleModal from "@/components/common/SimpleModal";
import Toast from "@/components/common/Toast";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ANIMATION_DURATION_MS = 220;

interface BuyOrNotMenuProps {
  visible: boolean;
  onClose: () => void;
  historyItemNames: string[];
  onPressNewRecommendation?: () => void;
}

export default function BuyOrNotMenu({
  visible,
  onClose,
  historyItemNames,
  onPressNewRecommendation,
}: BuyOrNotMenuProps) {
  const [isMounted, setIsMounted] = useState(visible);
  const [items, setItems] = useState(historyItemNames);
  const [toastVisible, setToastVisible] = useState(false);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    setItems(historyItemNames);
  }, [historyItemNames]);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [visible, translateX]);

  if (!isMounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          <View style={styles.searchBar}>
            <SearchIcon style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="검색..."
              placeholderTextColor="#B5B5B5"
            />
          </View>

          <Pressable
            style={styles.newRecommendCard}
            onPress={onPressNewRecommendation}
          >
            <View style={styles.newRecommendButton}>
              <Ionicons name="pricetag" size={14} color="#2D322E" />
              <Text style={styles.newRecommendText}>새로 살말 추천 받기</Text>
              <ArrowIcon style={styles.arrow} />
            </View>
          </Pressable>

          <View style={styles.divider}>
            {Array.from({ length: 32 }).map((_, index) => (
              <View key={index} style={styles.dividerDash} />
            ))}
          </View>

          <View style={styles.historyList}>
            <Text style={styles.sectionTitle}>추천 기록</Text>

            {items.map((name, index) => (
              <HistoryRow
                key={`${name}-${index}`}
                name={name}
                onDelete={() => {
                  setItems((prev) => prev.filter((_, i) => i !== index));
                  setToastVisible(true);
                }}
              />
            ))}
          </View>
        </Animated.View>

        <Toast
          visible={toastVisible}
          message="기록이 삭제되었습니다."
          onHide={() => setToastVisible(false)}
          bottom={75}
        />
      </View>
    </Modal>
  );
}

interface HistoryRowProps {
  name: string;
  onDelete: () => void;
}

function HistoryRow({ name, onDelete }: HistoryRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    Animated.timing(buttonOpacity, {
      toValue: next ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Pressable
        style={[styles.historyRow, isOpen && styles.historyRowOpen]}
        onLongPress={toggleOpen}
        onPress={() => isOpen && toggleOpen()}
      >
        <Text style={styles.historyItem} numberOfLines={1}>
          {name}
        </Text>

        {isOpen && (
          <Animated.View style={{ opacity: buttonOpacity }}>
            <Pressable
              style={styles.deleteButton}
              onPress={() => setIsConfirmVisible(true)}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </Pressable>
          </Animated.View>
        )}
      </Pressable>

      <SimpleModal
        visible={isConfirmVisible}
        title="추천 기록을 삭제하시겠습니까?"
        description="삭제 시 되돌릴 수 없습니다."
        danger
        confirmText="네"
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={() => {
          setIsConfirmVisible(false);
          onDelete();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(60, 50, 58, 0.55)",
  },

  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "68%",
    backgroundColor: "#FBFAF4",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  searchIcon: {
    width: 16,
    height: 16,
  },

  searchInput: {
    flex: 1,
    fontFamily: "WantedSansRegular",
    fontSize: 14,
    color: "#2D322E",
  },

  newRecommendCard: {
    width: "100%",
    height: 64,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",

    justifyContent: "center",
    alignItems: "center",

    boxShadow: [
      {
        offsetX: 4,
        offsetY: 4,
        blurRadius: 2,
        spreadDistance: 0,
        color: "rgba(255,255,255,0.30)",
        inset: true,
      },
      {
        offsetX: -4,
        offsetY: -4,
        blurRadius: 4,
        spreadDistance: 0,
        color: "rgba(104,171,110,0.30)",
        inset: true,
      },
    ],
  },

  newRecommendButton: {
    width: "100%",
    height: 44,

    paddingVertical: 12,
    paddingHorizontal: 13,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    boxShadow: [
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 2,
        spreadDistance: 0,
        color: "rgba(104,171,110,0.15)",
      },
    ],
  },

  newRecommendText: {
    fontSize: 12,
    color: "#464B47",
    fontFamily: "Galmuri9",
  },

  arrow: {
    width: 12,
    height: 12,
  },

  divider: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dividerDash: {
    width: 4,
    height: 1,
    backgroundColor: "#9CCCA0",
  },

  historyList: {
    marginTop: 16,
    gap: 16,
  },

  sectionTitle: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 12,
    color: "#787D79",
  },

  deleteButton: {
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 4,
    backgroundColor: "#FBFBF5",
    paddingHorizontal: 14,
    paddingVertical: 8,

    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 4,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.10)",
      },
    ],
  },

  deleteButtonText: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 16,
    color: "#E4463C",
  },

  historyRow: {
    minHeight: 54,
    paddingVertical: 8,
    paddingHorizontal: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,

    backgroundColor: "#FBFAF4",
  },

  historyRowOpen: {
    backgroundColor: "#F0FFE5",
  },

  historyItem: {
    flex: 1,
    minWidth: 0,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#2D322E",
  },
});
