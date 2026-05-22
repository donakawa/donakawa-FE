import { StyleSheet } from "react-native";

export const changePasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
  },

  header: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: "GalmuriBold",
    fontSize: 22,
    color: "#7A5751",
  },

  content: {
    flex: 1,
    paddingHorizontal: 6,
  },

  formArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 178,
  },

  form: {
    width: 307,
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

  buttonArea: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 100,
  },

  submitButton: {
    width: 307,
    height: 48,
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

  successArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 160,
  },

  successContent: {
    alignItems: "center",
    gap: 32,
  },

  successText: {
    textAlign: "center",
    fontFamily: "GalmuriBold",
    fontSize: 22,
    color: "#7A5751",
  },
});

// withdrawal
export const withdrawalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    gap: 20,
    alignItems: "center",
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

  innerContent: {
    gap: 56,
  },

  innerBottomContent: {
    gap: 64,
  },

  noticeBox: {
    width: "100%",
    height: 70,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FAFFF9",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  noticeText: {
    fontFamily: "WantedSansRegular",
    fontSize: 14,
    lineHeight: 21,
    color: "#464B47",
  },

  form: {
    width: "100%",
    paddingHorizontal: 6,
    gap: 18,
  },

  label: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 20,
    color: "#2D322E",
  },

  inputGroup: {
    gap: 8,
  },

  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#5F6460",
    outlineWidth: 0,
  },

  passwordInputWrap: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontFamily: "WantedSansRegular",
    fontSize: 16,
    color: "#2D322E",
    outlineWidth: 0,
  },

  eyeButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  authArea: {
    alignItems: "center",
    gap: 24,
  },

  confirmButton: {
    width: 307,
    height: 48,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#AAAFAB",
    backgroundColor: "#DCE1DD",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButtonActive: {
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

  confirmText: {
    fontFamily: "Galmuri",
    fontSize: 14,
    color: "#919692",
  },

  confirmTextActive: {
    color: "#2D322E",
  },

  divider: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  dividerLine: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CCCA0",
  },

  dividerText: {
    paddingHorizontal: 4,
    fontFamily: "WantedSansMedium",
    fontSize: 12,
    color: "#787D79",
  },

  googleButton: {
    width: 317,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#747775",
    backgroundColor: "#fff",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 60,
  },

  googleText: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#1F1F1F",
  },
});
