import { StyleSheet } from "react-native";

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
    alignItems: "center",
  },

  settingContent: {
    width: "100%",
    gap: 28,
  },

  section: {
    width: "100%",
    gap: 12,
  },

  sectionTitle: {
    fontFamily: "WantedSansMedium",
    fontSize: 12,
    color: "#787D79",
  },

  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FAFFF9",
    paddingVertical: 5,
    paddingHorizontal: 16,
  },

  row: {
    width: "100%",
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  rowTitle: {
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#2D322E",
  },

  rowDescription: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#787D79",
  },

  dangerText: {
    color: "#E4463C",
  },

  arrowRight: {
    width: 17,
    height: 17,
  },

  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
