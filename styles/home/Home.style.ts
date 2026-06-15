import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  content: {
    alignItems: "center",
  },

  heroSection: {
    width: "100%",
    backgroundColor: "#F0FFE5",
  },

  headerWrap: {
    width: "100%",
    backgroundColor: "#F0FFE5",
    paddingTop: 42,
    alignItems: "center",
  },

  header: {
    width: 335,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  coinWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  coinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F3F48D",
    borderWidth: 1,
    borderColor: "#D5D66C",
    alignItems: "center",
    justifyContent: "center",
  },

  coinIcon: {
    fontFamily: "Galmuri9",
    fontSize: 11,
    color: "#7EC985",
  },

  coinText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#464B47",
  },

});
