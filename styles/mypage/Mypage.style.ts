import { StyleSheet } from "react-native";

// mypage
export const myPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
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
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#E0F9BF",
    width: 101,
    height: 101,
  },

  profileInfo: {
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
    height: 44,

    paddingVertical: 12,
    paddingHorizontal: 13,

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

// ProfileSettingModal
export const profileSettingModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: 335,
    backgroundColor: "#FAFFF9",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 20,
    alignItems: "center",
  },

  imageSelectModal: {
    paddingHorizontal: 3,
    paddingTop: 4,
    paddingBottom: 12,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },

  headerText: {
    fontSize: 16,
    fontFamily: "WantedSansMedium",
    color: "#464B47",
  },

  doneText: {
    fontSize: 16,
    fontFamily: "WantedSansMedium",
    color: "#7EC985",
  },

  form: {
    width: 271,
    alignSelf: "center",
    gap: 28,
  },

  title: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#464B47",
    textAlign: "center",
  },

  bottomContent: {
    width: "100%",
    gap: 28,
    alignItems: "center",
  },

  profileSettingImageWrap: {
    width: 125,
    height: 125,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  profileSettingImageCircle: {
    width: 125,
    height: 125,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#9CCCA0",
    backgroundColor: "#9CCCA0",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  profileSettingImage: {
    width: 125,
    height: 125,
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 5,
    width: 29,
    height: 29,
    borderRadius: 100,
    backgroundColor: "#9CCCA0",
    alignItems: "center",
    justifyContent: "center",
  },

  inputBox: {
    width: "100%",
    gap: 4,
  },

  input: {
    width: "100%",
    height: 47,
    borderWidth: 1,
    borderColor: "#E8F9C7",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 16,
    color: "#2D322E",
    fontFamily: "Galmuri9",
  },

  count: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#919692",
    fontFamily: "WantedSansRegular",
  },

  topContent: {
    gap: 8,
  },

  imageSelectContent: {
    width: "100%",
    gap: 24,
  },

  imageSelectHeader: {
    width: "100%",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: "#7EC985",
    paddingHorizontal: 16,
    paddingVertical: 22,
    gap: 4,
  },

  imageSelectSubText: {
    fontSize: 12,
    color: "#FAFFF9",
    fontFamily: "WantedSansRegular",
  },

  imageSelectTitle: {
    fontSize: 16,
    color: "#FBFBF5",
    fontFamily: "GalmuriBold",
  },

  profileGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 3,
    rowGap: 4,
  },

  profileGridItem: {
    width: 107,
    height: 107,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  profileGridImage: {
    width: 107,
    height: 107,
  },

  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#7EC985",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "WantedSansMedium",
  },

  imageSelectButtonRow: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  prevButton: {
    width: 75,
    height: 37,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E0F9BF",
    backgroundColor: "#F0FFE5",
    alignItems: "center",
    justifyContent: "center",
  },

  completeButton: {
    width: 75,
    height: 37,
    borderRadius: 7,
    backgroundColor: "#7EC985",
    alignItems: "center",
    justifyContent: "center",
  },

  prevButtonText: {
    fontSize: 14,
    color: "#464B47",
    fontFamily: "WantedSansMedium",
  },

  completeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "WantedSansMedium",
  },
});
