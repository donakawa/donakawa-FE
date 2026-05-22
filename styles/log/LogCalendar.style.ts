import { StyleSheet } from "react-native";

// LogCalendar
export const logCalendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
    alignItems: "center",
  },

  header: {
    width: 335,
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  totalAmount: {
    fontSize: 16,
    fontFamily: "GalmuriBold",
    color: "#7A5751",
  },

  purchaseCount: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#E67972",
  },

  closeImage: {},

  monthControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  arrowButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  selectBox: {
    height: 35,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FFE5",
    paddingVertical: 10,
  },

  yearBox: {
    width: 102,
  },

  monthBox: {
    width: 73,
  },

  selectText: {
    fontSize: 16,
    fontFamily: "WantedSansMedium",
    color: "#7A5751",
  },

  weekRow: {
    width: 335,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weekText: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#5F6460",
  },

  bottomControl: {
    width: 335,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  todayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FFE5",
  },

  todayText: {
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    color: "#464B47",
  },

  modeSwitch: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 50,
    backgroundColor: "#F0FFE5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
    position: "relative",
    overflow: "hidden",
  },

  modeSwitchInnerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modeButton: {
    width: 34,
    height: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  activeMode: {
    backgroundColor: "#FBFBF5",
    borderWidth: 1,
    borderColor: "#E0F9BF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  divider: {
    width: 335,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CCCA0",
  },

  dayPurchaseList: {
    gap: 8,
  },

  dateTitle: {
    width: 335,
    fontSize: 12,
    fontFamily: "Galmuri9",
    color: "#7A5751",
  },

  itemList: {
    width: 335,
    gap: 12,
  },
});

// Calendar
export const calendarStyles = StyleSheet.create({
  calendarGrid: {
    width: 335,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },

  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    gap: 5,
  },

  circle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  pinkCircle: {
    backgroundColor: "#FFDBEB",
    borderRadius: 50,
  },

  greenCircle: {
    backgroundColor: "#E8F9C7",
    borderRadius: 50,
  },

  dayText: {
    fontSize: 14,
    fontFamily: "WantedSansRegular",
    color: "#7A5751",
  },

  daySubText: {
    width: 70,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "WantedSansRegular",
    color: "#919692",
  },

  redText: {
    color: "#E4463C",
  },
});

// CalendarItemCard
export const calendarItemCardStyles = StyleSheet.create({
  card: {
    height: 122,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 10,
    backgroundColor: "#FAFFF9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 5,
    backgroundColor: "#eee",
    borderColor: "#E0F9BF",
    borderWidth: 1,
  },

  leftinfo: {
    flexDirection: "row",
    gap: 12,
  },

  info: {
    paddingTop: 4,
    gap: 4,
  },

  price: {
    fontFamily: "GalmuriBold",
    fontSize: 16,
    color: "#2D322E",
  },

  name: {
    fontFamily: "WantedSansRegular",
    fontSize: 14,
    color: "#464B47",
  },

  rightinfo: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  brand: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#787D79",
  },
});
