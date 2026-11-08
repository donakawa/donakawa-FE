import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: 375,
    alignItems: "center",
  },
  logoWrap: {
    width: 150,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 56,
    },
  form: {
    width: 323,
    alignItems: "center",
  },
  inputs: {
    alignSelf: "stretch",
    gap: 8,
  },
  findButton: {
    alignSelf: "flex-end",
    height: 48,
    padding: 4,
    marginBottom: 24,
    justifyContent: "center",
  },
  findText: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 12,
    lineHeight: 18,
    color: "#5F6460",
    textDecorationLine: "underline",
  },
  socialWrap: {
    gap: 8,
  },
  signupText: {
    marginTop: 28,
    textAlign: "center",
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#2D322E",
    textDecorationLine: "underline",
  },
  socialSection: {
  width: 335,
  marginTop: 56,
  alignItems: "center",
},

dividerWrap: {
  width: 335,
  height: 26,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
},

// 점선 테두리의 윗변 1px만 보이도록 잘라 한 줄로 표시
divider: {
  position: "absolute",
  top: 12,
  left: 0,
  right: 0,
  height: 1,
  overflow: "hidden",
},

dividerLine: {
  height: 2,
  borderStyle: "dashed",
  borderWidth: 1,
  borderColor: "#9CCCA0",
},

dividerText: {
  backgroundColor: "#FBF9F5",
  paddingVertical: 4,

  fontFamily: "WantedSansSemiBold",
  fontSize: 12,
  lineHeight: 18,
  color: "#787D79",
},

socialButtons: {
  gap: 12,
},

signupButton: {
  height: 48,
  padding: 4,
  marginTop: 46,
  justifyContent: "center",
},

signupLink: {
  fontFamily: "WantedSansMedium",
  fontSize: 14,
  lineHeight: 21,

  color: "#141915",
  textDecorationLine: "underline",
},
  
});

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  header: {
    paddingHorizontal: 20,
  },
  progressBack: {
    width: "100%",
    height: 8,
    backgroundColor: "#F0FFE5",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#DCE1DD",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#7EC985",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 75,
  },
  inner: {
    width: 322,
  },
  stepText: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    lineHeight: 21,
    color: "#7EC985",
    marginBottom: 28,
  },
  title: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 20,
    lineHeight: 30,
    color: "#2D322E",
    marginBottom: 28,
  },
  buttonSpace: {
    marginTop: 104,
  },
  codeInputDisabled: {
  backgroundColor: "#DCE1DD",
  borderColor: "#AAAFAB",
  color: "#919692",
},

codeTimer: {
  alignSelf: "flex-end",
  marginTop: 6,
  fontFamily: "WantedSansMedium",
  fontSize: 14,
  lineHeight: 21,
  color: "#5F6460",
},

codeTimerExpired: {
  color: "#E4463C",
},

resendText: {
  marginTop: 92,
  textAlign: "center",
  fontFamily: "WantedSansRegular",
  fontSize: 12,
  lineHeight: 18,
  color: "#7EC985",
  textDecorationLine: "underline",
},

resendTextDisabled: {
  color: "#5F6460",
  textDecorationLine: "none",
},
  codeRow: {
    width: 335,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeInput: {
    width: 51,
    height: 52,
    borderRadius: 4,
    backgroundColor: "#E8F9C7",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    textAlign: "center",
    fontFamily: "GalmuriBold",
    fontSize: 20,
    color: "#2D322E",
  },
  timer: {
    alignSelf: "flex-end",
    marginTop: 8,
    fontFamily: "WantedSansRegular",
    fontSize: 11,
    color: "#787D79",
  },
  helpText: {
    alignSelf: "flex-end",
    marginTop: 6,
    marginBottom: 14,
    fontFamily: "WantedSansRegular",
    fontSize: 10,
    color: "#787D79",
  },
  errorText: {
  alignSelf: "flex-end",
  marginTop: 6,
  marginBottom: 14,
  fontFamily: "WantedSansRegular",
  fontSize: 10,
  color: "#E15B4F",
},

passwordCheckSpace: {
  height: 28,
},
nicknameRow: {
    width: 335,
    flexDirection: "row",
    alignItems: "center",
  },
  nicknameInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 4,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#2D322E",
  },
  checkButton: {
    width: 48,
    height: 48,
    marginLeft: 6,
    backgroundColor: "#E8F9C7",
    borderWidth: 2,
    borderColor: "#9CCCA0",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  checkButtonText: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#7A5751",
  },

  nicknameMessageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    minHeight: 18, 
  },
  successText: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#7EC985",
  },
  duplicateText: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#E4463C",
  },
  countText: {
    fontFamily: "WantedSansRegular",
    fontSize: 12,
    color: "#787D79",
  },
  completeContainer: {
    flex: 1,
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 29,
  },
  completeTitle: {
    fontFamily: "GalmuriBold",
    fontSize: 20,
    color: "#7A5751",
    marginBottom: 58,
  },
  completeIcon: {
    marginBottom: 58,
  },
  modalDim: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
  alignItems: "center",
  justifyContent: "center",
},

verifyModal: {
  width: 336,
  height: 200,
  borderRadius: 7,
  backgroundColor: "#FBFBF5",
  alignItems: "center",
  justifyContent: "center",
  gap: 14,
},

verifyModalText: {
  marginTop: 4,
  marginBottom: 22,
  fontFamily: "GalmuriBold",
  fontSize: 16,
  lineHeight: 24,
  color: "#2D322E",
},

verifyModalButton: {
  width: 264,
  height: 40,
  borderRadius: 16,
  backgroundColor: "#7EC985",
  alignItems: "center",
  justifyContent: "center",
},

verifyModalButtonText: {
  fontFamily: "WantedSansSemiBold",
  fontSize: 16,
  lineHeight: 24,
  color: "#FFFFFF",
},
  
});