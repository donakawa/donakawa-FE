import { StyleSheet } from "react-native";

export const simpleModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  modalBox: {
    width: 336,
    height: 195,
    borderRadius: 8,
    backgroundColor: "#FBFBF5",

    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingTop: 48,
    paddingBottom: 32,
    gap: 24,
  },

  textArea: {
    gap: 12,
  },

  title: {
    color: "#2D322E",
    fontFamily: "GalmuriBold",
    fontSize: 16,
  },

  description: {
    color: "#787D79",
    fontFamily: "WantedSansMedium",
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 32,
  },

  cancelButton: {
    width: 116,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    width: 116,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#7EC985",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#464B47",
    fontFamily: "WantedSansMedium",
    fontSize: 16,
  },

  confirmText: {
    color: "#FFFFFF",
    fontFamily: "WantedSansMedium",
    fontSize: 16,
  },
});
