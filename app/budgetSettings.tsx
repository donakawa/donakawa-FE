import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { budgetSettingStyles as styles } from "@/styles/mypage/BudgetSettings.style";

import ArrowIcon from "@/assets/images/log/arrow_left.svg";
import DollarIcon from "@/assets/images/mypage/attach-money.svg";
import CardIcon from "@/assets/images/mypage/credit-card.svg";
import MoneyIcon from "@/assets/images/mypage/money-bag-green.svg";
import PaymentIcon from "@/assets/images/mypage/payment.svg";
import ShoppingBagIcon from "@/assets/images/mypage/shopping-bag.svg";
import UpdateIcon from "@/assets/images/mypage/update-rounded.svg";
import WalletIcon from "@/assets/images/mypage/wallet.svg";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Strategy = "asset" | "balance" | "free";

type Form = {
  income: string;
  incomeDay: string;
  fixedCost: string;
  saving: string;
  strategy: Strategy | "";
  goalAmount: string;
};

const TOTAL_PROGRESS_STEP = 6;

const moneyButtons = [
  { label: "+100만", amount: 1000000 },
  { label: "+50만", amount: 500000 },
  { label: "+10만", amount: 100000 },
  { label: "+5만", amount: 50000 },
  { label: "+1만", amount: 10000 },
];

const strategies = [
  {
    key: "asset",
    Icon: MoneyIcon,
    title: "자산 형성",
    desc: "수입의 10% 내외 알뜰한 쇼핑",
  },
  {
    key: "balance",
    Icon: WalletIcon,
    title: "균형 지출",
    desc: "수입의 25% 내외 알뜰한 쇼핑",
  },
  {
    key: "free",
    Icon: ShoppingBagIcon,
    title: "자유 지출",
    desc: "수입의 50% 이상 넉넉한 쇼핑",
  },
] as const;

function formatMoney(value: string) {
  const number = value.replace(/[^0-9]/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toNumber(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
}

function calculateGoalAmount(income: number, strategy: Strategy) {
  const ratioByStrategy: Record<Strategy, number> = {
    asset: 0.1,
    balance: 0.25,
    free: 0.5,
  };

  return Math.floor(income * ratioByStrategy[strategy]);
}

export default function BudgetSettings() {
  const [step, setStep] = useState<Step>(1);

  const progressAnim = useRef(
    new Animated.Value(1 / TOTAL_PROGRESS_STEP),
  ).current;

  const [form, setForm] = useState<Form>({
    income: "",
    incomeDay: "",
    fixedCost: "",
    saving: "",
    strategy: "",
    goalAmount: "",
  });

  const selectedStrategy = strategies.find(
    (item) => item.key === form.strategy,
  );

  const isSummaryOrEditStep = step === 7 || step === 8;

  const isValid =
    step === 1
      ? form.income.length > 0
      : step === 2
        ? form.incomeDay.length > 0
        : step === 3
          ? form.fixedCost.length > 0
          : step === 4
            ? form.saving.length > 0
            : step === 5
              ? form.strategy.length > 0
              : step === 6
                ? form.goalAmount.length > 0
                : true;

  useEffect(() => {
    if (step > TOTAL_PROGRESS_STEP) return;

    Animated.timing(progressAnim, {
      toValue: step / TOTAL_PROGRESS_STEP,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressAnim, step]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const updateForm = (key: keyof Form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addMoney = (key: "income" | "fixedCost" | "saving", amount: number) => {
    const nextValue = toNumber(form[key]) + amount;
    updateForm(key, formatMoney(String(nextValue)));
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }

    if (step === 6) {
      setStep(5);
      return;
    }

    if (step === 7 || step === 8) {
      setStep(6);
      return;
    }

    setStep((prev) => (prev - 1) as Step);
  };

  const handleSkip = () => {
    setStep(6);
  };

  const handleSubmit = () => {
    if (!isValid) return;

    if (step === 5) {
      if (form.strategy === "") return;

      const income = toNumber(form.income);
      const goalAmount = calculateGoalAmount(income, form.strategy);

      updateForm("goalAmount", formatMoney(String(goalAmount)));
      setStep(6);
      return;
    }

    if (step === 6) {
      setStep(7);
      return;
    }

    if (step === 7) {
      router.back();
      return;
    }

    if (step === 8) {
      setStep(7);
      return;
    }

    setStep((prev) => (prev + 1) as Step);
  };

  const renderProgress = () => {
    if (step > TOTAL_PROGRESS_STEP) return null;

    return (
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>
    );
  };

  const renderMoneyButtons = (key: "income" | "fixedCost" | "saving") => (
    <View style={styles.moneyButtonArea}>
      {moneyButtons.map((item) => (
        <Pressable
          key={item.label}
          style={styles.moneyButton}
          onPress={() => addMoney(key, item.amount)}
        >
          <Text style={styles.moneyButtonText}>{item.label}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.moneyButton} onPress={() => updateForm(key, "")}>
        <Text style={styles.moneyButtonText}>정정</Text>
      </Pressable>
    </View>
  );

  const renderInputStep = () => {
    if (step === 1) {
      return (
        <View style={styles.formTop}>
          <View style={styles.form}>
            <View style={styles.questionRow}>
              <Text style={styles.question}>월 수입은 얼마인가요?</Text>
              <Text style={styles.questionStar}>*</Text>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.moneyInput}
                placeholder="123,456"
                placeholderTextColor="#C3C8C4"
                keyboardType="number-pad"
                value={form.income}
                onChangeText={(text) => updateForm("income", formatMoney(text))}
              />
              <Text style={styles.unit}>원</Text>
            </View>
          </View>

          {renderMoneyButtons("income")}
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.form}>
          <Text style={styles.question}>언제 수입이 들어오나요?</Text>

          <View style={styles.dayRow}>
            <Text style={styles.unit}>매달</Text>
            <TextInput
              style={styles.dayInput}
              placeholder="20"
              placeholderTextColor="#C3C8C4"
              keyboardType="number-pad"
              maxLength={2}
              value={form.incomeDay}
              onChangeText={(text) =>
                updateForm("incomeDay", text.replace(/[^0-9]/g, ""))
              }
            />
            <Text style={styles.unit}>일</Text>
          </View>
        </View>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.formTop}>
          <View style={styles.form}>
            <View style={styles.questionColumn}>
              <Text style={styles.question}>월 고정 생활비가 얼마인가요?</Text>
              <Text style={styles.description}>
                월세, 교통비, 식비 등을 합산한 금액을 입력해 주세요.
              </Text>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.moneyInput}
                placeholder="123,456"
                placeholderTextColor="#C3C8C4"
                keyboardType="number-pad"
                value={form.fixedCost}
                onChangeText={(text) =>
                  updateForm("fixedCost", formatMoney(text))
                }
              />
              <Text style={styles.unit}>원</Text>
            </View>
          </View>

          {renderMoneyButtons("fixedCost")}
        </View>
      );
    }

    if (step === 4) {
      return (
        <View style={styles.formTop}>
          <View style={styles.form}>
            <View style={styles.questionColumn}>
              <Text style={styles.question}>
                매달 저축 · 투자액은 얼마인가요?
              </Text>
              <Text style={styles.description}>
                소득의 20%인 20만원 이상이 가장 이상적이에요.
              </Text>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.moneyInput}
                placeholder="123,456"
                placeholderTextColor="#C3C8C4"
                keyboardType="number-pad"
                value={form.saving}
                onChangeText={(text) => updateForm("saving", formatMoney(text))}
              />
              <Text style={styles.unit}>원</Text>
            </View>
          </View>

          {renderMoneyButtons("saving")}
        </View>
      );
    }

    return null;
  };

  const renderStrategyStep = () => (
    <View style={styles.strategyForm}>
      <View style={styles.questionRow}>
        <Text style={styles.question}>어떤 소비 전략을 선택하시겠어요?</Text>
        <Text style={styles.questionStar}>*</Text>
      </View>

      <View style={styles.strategyList}>
        {strategies.map(({ key, Icon, title, desc }) => (
          <Pressable
            key={key}
            style={[
              styles.strategyCard,
              form.strategy === key && styles.strategyCardActive,
            ]}
            onPress={() => updateForm("strategy", key)}
          >
            <Icon />
            <View style={styles.strategyTextBox}>
              <Text style={styles.strategyTitle}>{title}</Text>
              <Text style={styles.strategyDesc}>{desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderGoalStep = () => (
    <View style={styles.goalForm}>
      <View style={styles.questionColumn}>
        <Text style={styles.strategyLabel}>
          {selectedStrategy?.title ?? "자산 형성 전략"}
        </Text>
        <Text style={styles.goalTitle}>
          까드럭님에게 딱 맞는{"\n"}온라인 쇼핑 목표액은
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.moneyInput}
          placeholder="100,000"
          placeholderTextColor="#C3C8C4"
          keyboardType="number-pad"
          value={form.goalAmount}
          onChangeText={(text) => updateForm("goalAmount", formatMoney(text))}
        />
        <Text style={styles.unit}>원 이하</Text>
      </View>
    </View>
  );

  const renderSummaryStep = () => (
    <View style={styles.summaryArea}>
      <View style={styles.goalCard}>
        <Text style={styles.goalCardTitle}>
          {selectedStrategy?.title ?? "자산 형성 전략"} 전략
        </Text>

        <View style={styles.goalInnerCard}>
          <View style={styles.singleCardRow}>
            <View style={styles.cardRow}>
              <DollarIcon />
              <Text style={styles.cardLabel}>온라인 쇼핑 목표액</Text>
            </View>
            <Text style={styles.cardValue}>{form.goalAmount}원 이하</Text>
          </View>

          <View style={styles.singleCardRow}>
            <View style={styles.cardRow}>
              <UpdateIcon />
              <Text style={styles.cardLabel}>갱신일</Text>
            </View>
            <Text style={styles.cardValue}>매달 {form.incomeDay}일</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.iconContainer}>
          <MoneyIcon />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>월 수입</Text>
          <Text style={styles.infoValue}>{form.income}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.iconContainer}>
          <PaymentIcon />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>월 고정 생활비</Text>
          <Text style={styles.infoValue}>{form.fixedCost}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.iconContainer}>
          <CardIcon />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>저축 · 투자액</Text>
          <Text style={styles.infoValue}>{form.saving}</Text>
        </View>
      </View>
    </View>
  );

  const renderEditStep = () => (
    <View style={styles.editArea}>
      <View style={styles.goalCard}>
        <Text style={styles.goalCardTitle}>
          {selectedStrategy?.title ?? "자산 형성 전략"} 전략
        </Text>

        <View style={styles.goalInnerCard}>
          <View style={styles.singleCardRow}>
            <View style={styles.cardRow}>
              <DollarIcon />
              <Text style={styles.cardLabel}>온라인 쇼핑 목표액</Text>
            </View>

            <View style={styles.editGoalRow}>
              <TextInput
                style={styles.editGoalInput}
                keyboardType="number-pad"
                value={form.goalAmount}
                onChangeText={(text) =>
                  updateForm("goalAmount", formatMoney(text))
                }
              />
              <Text style={styles.cardValue}>원 이하</Text>
            </View>
          </View>

          <View style={styles.singleCardRow}>
            <View style={styles.cardRow}>
              <UpdateIcon />
              <Text style={styles.cardLabel}>갱신일</Text>
            </View>

            <View style={styles.editDayRow}>
              <Text style={styles.cardValue}>매달</Text>
              <TextInput
                style={styles.editDayInput}
                keyboardType="number-pad"
                maxLength={2}
                value={form.incomeDay}
                onChangeText={(text) =>
                  updateForm("incomeDay", text.replace(/[^0-9]/g, ""))
                }
              />
              <Text style={styles.cardValue}>일</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.editBottom}>
        <View style={styles.editItem}>
          <Text style={styles.editLabel}>월 수입</Text>
          <TextInput
            style={styles.fullInput}
            keyboardType="number-pad"
            value={form.income}
            onChangeText={(text) => updateForm("income", formatMoney(text))}
          />
        </View>

        <View style={styles.editItem}>
          <Text style={styles.editLabel}>월 고정 생활비</Text>
          <TextInput
            style={styles.fullInput}
            keyboardType="number-pad"
            value={form.fixedCost}
            onChangeText={(text) => updateForm("fixedCost", formatMoney(text))}
          />
        </View>

        <View style={styles.editItem}>
          <Text style={styles.editLabel}>저축 · 투자액</Text>
          <TextInput
            style={styles.fullInput}
            keyboardType="number-pad"
            value={form.saving}
            onChangeText={(text) => updateForm("saving", formatMoney(text))}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={10}>
            <ArrowIcon />
          </Pressable>

          <Text style={styles.title}>목표 예산 설정</Text>

          {step === 7 ? (
            <Pressable onPress={() => setStep(8)}>
              <Text style={styles.editText}>수정</Text>
            </Pressable>
          ) : (
            <View style={styles.headerBlank} />
          )}
        </View>
      </View>

      {renderProgress()}

      <View style={styles.bodyContent}>
        <View
          style={[styles.formArea, isSummaryOrEditStep && styles.formAreaTop]}
        >
          {step <= 5 && (
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>SKIP</Text>
            </Pressable>
          )}

          {step <= 4 && renderInputStep()}
          {step === 5 && renderStrategyStep()}
          {step === 6 && renderGoalStep()}
          {step === 7 && renderSummaryStep()}
          {step === 8 && renderEditStep()}
        </View>

        <View style={styles.buttonArea}>
          <Pressable
            style={[styles.submitButton, isValid && styles.submitButtonActive]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text
              style={[styles.submitText, isValid && styles.submitTextActive]}
            >
              {step <= 5 ? "다음" : "완료"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
