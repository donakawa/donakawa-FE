import { StyleSheet } from "react-native";

export const changePasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
  },

  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: 100,
  },

  header: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  title: {
    fontFamily: "GalmuriBold",
    fontSize: 22,
    color: "#7A5751",
  },

  form: {
    width: "100%",
    marginTop: 178,
    gap: 28,
  },

  label: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 20,
    color: "#2D322E",
  },

  inputBox: {
    width: "100%",
    gap: 8,
  },

  inputGroup: {
    width: "100%",
    gap: 28,
  },

  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#2D322E",
  },

  passwordInputWrap: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    outlineWidth: 0,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#2D322E",
  },

  eyeButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  helper: {
    textAlign: "right",
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#787D79",
  },

  submitButton: {
    position: "absolute",
    bottom: 100,
    width: 307,
    height: 48,
    alignSelf: "center",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#AAAFAB",
    backgroundColor: "#DCE1DD",
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonActive: {
    borderColor: "#9CCCA0",
    backgroundColor: "#E8F9C7",

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

  submitText: {
    fontFamily: "Galmuri",
    fontSize: 16,
    color: "#919692",
  },

  submitTextActive: {
    color: "#464B47",
  },
});
