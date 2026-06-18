import { StyleSheet } from "react-native";

export const budgetSettingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9F5",
  },

  bodyContent: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    // gap: 56,
  },

  formArea: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  formAreaTop: {
    justifyContent: "flex-start",
    paddingTop: 28,
  },

  headerContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },

  editText: {
    fontSize: 18,
    fontFamily: "WantedSansSemiBold",
    color: "#7EC985",
  },

  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#F0FFE5",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#DCE1DD",
    marginTop: 4,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#7EC985",
  },

  skipButton: {
    position: "absolute",
    top: 20,
    right: 0,
  },

  skipText: {
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    color: "#7EC985",
    textDecorationLine: "underline",
  },

  formTop: {
    width: "100%",
    alignItems: "center",
    gap: 108,
  },

  form: {
    width: "100%",
    alignItems: "center",
    gap: 26,
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  questionColumn: {
    alignItems: "center",
    gap: 8,
  },

  question: {
    fontSize: 20,
    fontFamily: "WantedSansSemiBold",
    color: "#2D322E",
    textAlign: "center",
  },

  questionStar: {
    fontSize: 20,
    fontFamily: "WantedSansSemiBold",
    color: "#E67972",
  },

  description: {
    fontSize: 14,
    fontFamily: "WantedSansRegular",
    color: "#5F6460",
    textAlign: "center",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  moneyInput: {
    width: 227,
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#464B47",
    fontFamily: "WantedSansRegular",
  },

  unit: {
    fontSize: 16,
    fontFamily: "Galmuri",
    color: "#2D322E",
  },

  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  dayInput: {
    width: 176,
    height: 48,
    borderWidth: 1,
    borderColor: "#7EC985",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#464B47",
    fontFamily: "WantedSansRegular",
  },

  moneyButtonArea: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },

  moneyButton: {
    width: 104,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#FAFFF9",
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

  moneyButtonText: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#2D322E",
  },

  strategyForm: {
    width: "100%",
    alignItems: "center",
    gap: 28,
  },

  strategyList: {
    width: "100%",
    gap: 8,
  },

  strategyCard: {
    height: 77,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 5,
    backgroundColor: "#FAFFF9",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },

  strategyCardActive: {
    backgroundColor: "#F0FFE5",
  },

  strategyTextBox: {
    gap: 4,
  },

  strategyTitle: {
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    color: "#2D322E",
  },

  strategyDesc: {
    fontSize: 12,
    fontFamily: "WantedSansRegular",
    color: "#787D79",
  },

  goalForm: {
    width: "100%",
    alignItems: "center",
    gap: 32,
  },

  strategyLabel: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#7EC985",
  },

  goalTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "WantedSansSemiBold",
    color: "#2D322E",
    textAlign: "center",
  },

  summaryArea: {
    width: "100%",
    gap: 10,
  },

  goalCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#F0FFE5",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },

  goalCardTitle: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    color: "#7EC985",
    textAlign: "center",
  },

  goalInnerCard: {
    minHeight: 185,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 10,
    backgroundColor: "#FAFFF9",
    paddingHorizontal: 20,
    paddingVertical: 32,
    justifyContent: "space-between",
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 11,
        spreadDistance: 0,
        color: "rgba(167, 197, 169, 0.3)",
        inset: true,
      },
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 11,
        spreadDistance: 0,
        color: "rgba(167, 197, 169, 0.3)",
        inset: true,
      },
    ],
  },

  singleCardRow: {
    gap: 8,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cardLabel: {
    fontSize: 12,
    fontFamily: "Galmuri9",
    color: "#787D79",
  },

  cardValue: {
    fontSize: 18,
    fontFamily: "WantedSansSemiBold",
    color: "#2D322E",
  },

  infoCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FAFFF9",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#E8F9C7",
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    gap: 2,
  },

  infoTitle: {
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    color: "#2D322E",
  },

  infoValue: {
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    color: "#7A5751",
  },

  editArea: {
    width: "100%",
    gap: 14,
  },

  editGoalRow: {
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editGoalInput: {
    width: 184,
    height: 31,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 18,
    color: "#2D322E",
    fontFamily: "WantedSansSemiBold",
  },

  editDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editDayInput: {
    minWidth: 47,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    textAlign: "center",
    fontSize: 18,
    color: "#2D322E",
    fontFamily: "WantedSansSemiBold",
  },

  editBottom: {
    gap: 12,
  },

  editItem: {
    gap: 8,
  },

  editLabel: {
    fontSize: 12,
    fontFamily: "WantedSansSemiBold",
    color: "#787D79",
  },

  fullInput: {
    width: "100%",
    height: 47,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 14,
    color: "#464B47",
    fontFamily: "WantedSansRegular",
  },

  buttonArea: {
    paddingBottom: 48,
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
    fontSize: 16,
    fontFamily: "Galmuri",
    color: "#919692",
  },

  submitTextActive: {
    color: "#2D322E",
  },
});
