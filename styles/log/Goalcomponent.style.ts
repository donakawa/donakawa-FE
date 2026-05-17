import { StyleSheet } from "react-native";

// GoalButton
export const goalButtonStyles = StyleSheet.create({
  container: {
    width: 163,
    height: 66,
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

  inner: {
    width: "100%",
    height: 50,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  RightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  title: {
    fontSize: 12,
    color: "#464B47",
    fontFamily: "Galmuri9",
  },

  arrow: {
    width: 12,
    height: 12,
  },
});

// GoalCard
export const goalCardStyles = StyleSheet.create({
  container: {
    width: 335,
    height: 96,

    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#7EC985",
    backgroundColor: "#FAFFF9",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftSection: {
    gap: 16,
  },

  createdAt: {
    fontSize: 12,
    color: "#AAAFAB",
    fontFamily: "WantedSansRegular",
  },

  bottomSection: {
    gap: 3,
  },

  title: {
    fontSize: 14,
    color: "#2D322E",
    fontFamily: "Galmuri9",
  },

  amount: {
    fontSize: 14,
    color: "#5F6460",
    fontFamily: "WantedSansRegular",
  },

  statusCircle: {
    width: 58,
    height: 58,

    borderRadius: 100,

    borderWidth: 3,
    borderColor: "#7EC985",
    backgroundColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",
  },

  stoppedCircle: {
    borderColor: "#E67972",
  },

  finishedAt: {
    fontSize: 12,
    color: "#76C57C",
    fontFamily: "Galmuri9",
  },

  statusText: {
    fontSize: 16,
    color: "#76C57C",
    fontFamily: "GalmuriBold",
  },

  stoppedText: {
    color: "#E4463C",
  },
});
