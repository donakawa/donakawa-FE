import { StyleSheet } from "react-native";

export const myPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 23,
    alignItems: "center",
  },

  header: {
    width: 335,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "GalmuriBold",
    fontSize: 22,
    color: "#7A5751",
  },

  settingButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
    width: 335,
    height: 255,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FAFFF9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  editButton: {
    position: "absolute",
    top: 14,
    right: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  profileContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  profileImageWrap: {
    width: 101,
    height: 101,
    borderRadius: 100,
    backgroundColor: "#E0F9BF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: 101,
    height: 101,
    resizeMode: "cover",
  },

  profileInfo: {
    flexDirection: "column",
    gap: 8,
  },

  nickname: {
    fontSize: 16,
    fontFamily: "Galmuri9",
    color: "#2D322E",
    textAlign: "center",
  },

  email: {
    fontSize: 12,
    fontFamily: "WantedSansRegular",
    color: "#787D79",
  },

  resetCard: {
    width: 335,
    height: 64,
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

  resetButton: {
    width: "100%",
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  resetText: {
    fontSize: 12,
    color: "#464B47",
    fontFamily: "Galmuri9",
  },

  arrow: {
    width: 12,
    height: 12,
  },

  logoutButton: {
    marginTop: 200,
    alignSelf: "center",
  },

  logoutText: {
    fontSize: 12,
    color: "#919692",
    textDecorationLine: "underline",
  },
});
