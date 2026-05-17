import { StyleSheet } from "react-native";

export const logPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 23,
    alignItems: "center",
  },

  cardContainer: {
    gap: 5,
  },

  header: {
    width: 335,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "GalmuriBold",
    fontSize: 22,
    color: "#7A5751",
  },

  calendarImage: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  goalManageWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-end",
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#7EC985",
  },

  goalManageText: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#7EC985",
  },

  arrowImage: {
    width: 12,
    height: 12,
  },

  cardList: {
    width: 335,
    gap: 28,
  },
});
