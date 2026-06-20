import type { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WishFlowBottomBarProps {
  notice?: string;
  current?: number;
  max?: number;
  leftSlot?: ReactNode;
  canConfirm: boolean;
  onConfirm: () => void;
  confirmLabel?: string;
}

export default function WishFlowBottomBar({
  notice,
  current,
  max,
  leftSlot,
  canConfirm,
  onConfirm,
  confirmLabel = "결정!",
}: WishFlowBottomBarProps) {
  const showCounter = current !== undefined && max !== undefined;

  const renderLeft = () => {
    if (leftSlot) return <View style={styles.leftWrap}>{leftSlot}</View>;
    if (notice) return <Text style={styles.noticeText}>{notice}</Text>;
    return <View style={styles.leftWrap} />;
  };

  return (
    <View style={styles.bottomBar}>
      {renderLeft()}
      <View style={styles.bottomRight}>
        {showCounter && (
          <Text style={styles.counterText}>
            {current}/{max}
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canConfirm}
          style={styles.confirmTouchable}
          onPress={() => {
            if (!canConfirm) return;
            onConfirm();
          }}
        >
          {canConfirm ? (
            <View style={styles.confirmBtnActive}>
              <Text style={styles.confirmTextActive}>{confirmLabel}</Text>
            </View>
          ) : (
            <View style={styles.confirmBtn}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FAFFF9",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px -4px 10px rgba(138, 167, 100, 0.30)",
  },
  leftWrap: {
    flex: 1,
  },
  noticeText: {
    color: "#AAAFAB",
    fontSize: 12,
    fontFamily: "Galmuri9",
    lineHeight: 18,
    flex: 1,
  },
  bottomRight: {
    width: 72,
    alignItems: "center",
    gap: 4,
  },
  counterText: {
    width: "100%",
    textAlign: "center",
    color: "#7EC985",
    fontSize: 14,
    fontFamily: "Galmuri9",
    lineHeight: 21,
  },
  confirmTouchable: {
    alignSelf: "stretch",
    height: 48,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#DCE1DD",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#C3C8C4",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnActive: {
    flex: 1,
    backgroundColor: "#E8F9C7",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#9CCCA0",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "inset 4px 4px 2px rgba(255, 255, 255, 0.30), inset -4px -4px 4px rgba(104, 171, 110, 0.30)",
  },
  confirmText: {
    color: "#AAAFAB",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  confirmTextActive: {
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
