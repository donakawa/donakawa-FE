import { StyleSheet } from "react-native";

export const characterStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 338,
    backgroundColor: "#F0FFE5",
    position: "relative",
    overflow: "hidden",
  },

  topArea: {
    width: "100%",
    height: 250,
    backgroundColor: "#F0FFE5",
    alignItems: "center",
    paddingTop: 40,
  },

  floorLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#464B47",
  },

  bottomArea: {
    width: "100%",
    height: 85,
    backgroundColor: "#E0F9BF",
    position: "relative",
  },

  speechBubble: {
    width: 204,
    height: 101,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
    alignItems: "center",
    justifyContent: "center",
  },

  tail: {
    position: "absolute",
    bottom: -9,
    left: 92,
    width: 16,
    height: 16,
    backgroundColor: "#FAFFF9",
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#9CCCA0",
    transform: [{ rotate: "45deg" }],
  },

  speechText: {
    fontFamily: "Galmuri9",
    fontSize: 16,
    lineHeight: 24,
    color: "#464B47",
    textAlign: "center",
  },

  speechTextHighlight: {
    color: "#E67972",
  },

  nameText: {
    marginTop: 14,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#7EC985",
  },

  donaImage: {
    position: "absolute",
    bottom: 18,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 120,
    resizeMode: "contain",
    zIndex: 3,
  },

  trashWrap: {
    position: "absolute",
    left: 60,
    bottom: 28,
    zIndex: 2,
  },

  sideButtons: {
    position: "absolute",
    right: 23,
    bottom: 22,
    gap: 6,
    zIndex: 4,
  },

  hamOuterButton: {
    width: 58,
    height: 58,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",
    padding: 9,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  hamHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
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

  hamInnerButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
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

  pawCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "#9CCCA0",
    alignItems: "center",
    justifyContent: "center",
  },

  decorateOuterButton: {
    width: 58,
    height: 66,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E67972",
    backgroundColor: "#FFD9EB",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  decorateHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
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

  decorateInnerButton: {
    width: 45,
    height: 53,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
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


  smallButtonText: {
    fontFamily: "Galmuri9",
    fontSize: 11,
    color: "#3D2B27",
  },
});

export const gaugeStyles = StyleSheet.create({
  container: {
    width: 335,
    height: 162,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
    position: "relative",
    overflow: "visible",
  },

  graph: {
    position: "absolute",
    top: 15,
    left: 42,
  },

  gaugeTextBox: {
    position: "absolute",
    top: 75,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },

  spentRow: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
  },

  foodIcon: {
    fontSize: 12,
    marginRight: 2,
  },

  spentText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    lineHeight: 18,
    color: "#E67972",
  },

  amountText: {
    marginLeft: 14,
    fontFamily: "GalmuriBold",
    fontSize: 18,
    lineHeight: 24,
    color: "#2D322E",
  },

  budgetText: {
    marginTop: 4,
    fontFamily: "Galmuri9",
    fontSize: 12,
    lineHeight: 18,
    color: "#787D79",
  },
});

export const actionStyles = StyleSheet.create({
  container: {
    width: 335,
    height: 136,
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },

  leftArea: {
    width: 120,
    height: 136,
  },

  tooltip: {
    position: "absolute",
    top: -50,
    left: -4,
    width: 125,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#F0FFE5",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  tooltipText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    lineHeight: 18,
    color: "#7A5751",
    textAlign: "center",
  },

  tooltipTail: {
    position: "absolute",
    bottom: -8,
    width: 14,
    height: 14,
    backgroundColor: "#F0FFE5",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#9CCCA0",
    transform: [{ rotate: "45deg" }],
  },

  budgetOuterCard: {
    width: 120,
    height: 136,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  cardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 5,
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

  innerCard: {
    width: 86,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
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

  budgetText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    lineHeight: 21,
    color: "#E67972",
    textAlign: "center",
  },

  rightArea: {
    flex: 1,
    gap: 8,
  },

  wideOuterCard: {
    height: 64,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  wideInnerCard: {
    width: "85%",
    height: 38,
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

  wideText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#464B47",
  },

  actionOuterCard: {
    flex: 1,
    width: 164,
    height: 116,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  actionInnerCard: {
    width: 120,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 8,
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

  actionImageWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
