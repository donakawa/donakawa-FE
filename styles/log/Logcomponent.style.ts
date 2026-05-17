import { StyleSheet } from "react-native";

// ReceiptCard
export const receiptCardStyles = StyleSheet.create({
  container: {
    width: 335,
    height: 250,
  },

  summaryCard: {
    position: "relative",
    width: 335,
    height: 206,
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    paddingTop: 9,
    paddingHorizontal: 13,
    gap: 12,
  },

  periodText: {
    fontSize: 12,
    color: "#787D79",
  },

  monthText: {
    color: "#9CCCA0",
    fontWeight: "600",
  },

  savedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },

  savedText: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#7A5751",
  },

  receipt: {
    alignItems: "center",
  },

  receiptBar: {
    width: 309,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#464B47",
  },

  receiptBox: {
    width: 295,
    minHeight: 166,

    marginTop: -4,
    paddingTop: 16,
    paddingBottom: 5,
    paddingHorizontal: 12,
    gap: 20,

    borderWidth: 0.5,
    borderColor: "#DCE1DD",
    backgroundColor: "#FBFBF5",

    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 4,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.15)",
        inset: true,
      },
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 4,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.10)",
      },
    ],
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerLeft: {
    flex: 1,
    fontSize: 12,
    color: "#919692",
  },

  headerCenter: {
    flex: 1,
    fontSize: 12,
    color: "#919692",
    textAlign: "center",
  },

  headerRight: {
    flex: 1,
    fontSize: 12,
    color: "#919692",
    textAlign: "right",
  },

  itemList: {
    gap: 12,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    flex: 1.4,
    fontFamily: "Galmuri9",
    fontSize: 14,
    lineHeight: 21,
    color: "#2D322E",
  },

  percentText: {
    flex: 0.8,
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#7EC985",
    textAlign: "center",
  },

  priceText: {
    flex: 1,
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#2D332F",
    textAlign: "right",
  },

  minusText: {
    flex: 1,
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#7EC985",
    textAlign: "right",
  },

  underDot: {
    gap: 12,
  },

  dotLine: {
    borderBottomWidth: 2,
    borderStyle: "dotted",
    borderColor: "#787D79",
  },

  todayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  todayLabel: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#2D322E",
    includeFontPadding: false,
  },

  todayPrice: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#7A5751",
    includeFontPadding: false,
  },
});

// DefenseCard
export const defenseCardStyles = StyleSheet.create({
  card: {
    width: 335,
    height: 191,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    padding: 16,
    justifyContent: "space-between",
  },

  shieldImage: {
    position: "absolute",
    width: 111,
    height: 152,
    right: 11,
    top: 16,
  },

  badgeWrap: {
    position: "relative",
    alignSelf: "flex-start",
  },

  union: {
    position: "absolute",
    width: 70,
    height: 16,
  },

  badge: {
    alignSelf: "flex-start",
    width: 70,
    zIndex: 2,
  },

  badgeText: {
    fontFamily: "WantedSansMedium",
    fontSize: 12,
    textAlign: "center",
    color: "#7EC985",
  },

  content: {
    gap: 8,
  },

  description: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#7A5751",
  },

  openCard: {
    paddingTop: 8,
    paddingHorizontal: 0,
    flexDirection: "column",
    gap: 16,
  },

  detailHeader: {
    gap: 8,
  },

  detailTitle: {
    paddingHorizontal: 8,

    fontFamily: "WantedSansMedium",
    fontSize: 12,
    color: "#787D79",
  },

  detailAmountRow: {
    height: 41,
    backgroundColor: "#E0F9BF",

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  detailAmountLabel: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#7A5751",
  },

  detailList: {
    paddingHorizontal: 13,
    gap: 8,
  },

  detailRow: {
    flexDirection: "row",
    gap: 8,
  },

  detailImage: {
    width: 22,
    height: 22,
  },

  detailItem: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#5F6460",
  },

  flipContainer: {
    width: 335,
    height: 191,
  },

  flipFace: {
    position: "absolute",
    width: 335,
    height: 191,
    backfaceVisibility: "hidden",
  },

  flipBack: {
    backfaceVisibility: "hidden",
  },
});

// TopDay
export const topdayCardStyles = StyleSheet.create({
  container: {
    width: 335,
    gap: 12,
  },

  topText: {
    fontFamily: "WantedSansMedium",
    fontSize: 12,
    color: "#787D79",
  },

  topdayBox: {
    width: 335,
    height: 113,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: 21,
    paddingHorizontal: 56,

    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,

    backgroundColor: "#FAFFF9",
  },

  dayItem: {
    alignItems: "center",
    gap: 8,
    width: 42,
  },

  iconWrap: {
    position: "relative",
    width: 42,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },

  dayText: {
    position: "absolute",
    bottom: -6,
  },

  dayLabel: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#464B47",
  },
});

// ValueCard
export const valueCardStyles = StyleSheet.create({
  container: {
    width: 335,
    gap: 12,
  },

  title: {
    fontFamily: "WantedSansMedium",
    fontSize: 12,
    color: "#787D79",
  },

  card: {
    width: 335,

    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 16,

    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,

    backgroundColor: "#FAFFF9",
  },

  valueRow: {
    gap: 8,
  },

  valueLabel: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#2D322E",
  },

  valueContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  blockWrap: {
    flexDirection: "row",
    gap: 4,
  },

  valueBlock: {
    width: 20,
    height: 20,
    backgroundColor: "#E8F9C7",
  },

  valueBlockActive: {
    backgroundColor: "#7EC985",
  },

  valuePercent: {
    textAlign: "center",

    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#2D322E",
  },
});
