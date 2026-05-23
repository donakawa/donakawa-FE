import { StyleSheet } from "react-native";

export const authInputStyles = StyleSheet.create({
  container: {
    width: 322,
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#464B47",
    paddingVertical: 0,
  },
});

export const authButtonStyles = StyleSheet.create({
  button: {
    width: 307,
    height: 48,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    boxShadow: [
        {
            offsetX: 0,
            offsetY: 4,
            blurRadius: 4,
            spreadDistance: 0,
            color: "rgba(126, 201, 133, 0.35)",
      },
    ]
  },
  google: {
    width: 317,
    height: 48,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#747775",

    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",
    },

kakao: {
  width: 317,
  height: 48,

  backgroundColor: "#FEE500",

  borderRadius: 12,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  position: "relative",
},

socialText: {
  fontFamily: "WantedSansRegular",
  fontSize: 16,
  lineHeight: 24,
  color: "#1F1F1F",
},
  disabled: {
    backgroundColor: "#DCE1DD",
    borderWidth: 1,
    borderColor: "#AAAFAB",
  },
  text: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    lineHeight: 21,
    color: "#2D322E",
  },
  disabledText: {
    color: "#919692",
  },
});