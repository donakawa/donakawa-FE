import AddFolderButton from "@/components/common/AddFolderButton";
import AlertModal from "@/components/common/AlertModal";
import Button from "@/components/common/Button";
import ClothesButton from "@/components/common/ClothesButton";
import CustomizeHamsterButton from "@/components/common/CustomizeHamsterButton";
import DoneButton from "@/components/common/DoneButton";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import FolderCard from "@/components/common/FolderCard";
import IconPixelButton from "@/components/common/IconPixelButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import Input from "@/components/common/Input";
import InsetShadow from "@/components/common/InsetShadow";
import LargePixelButton from "@/components/common/LargePixelButton";
import MenuDropdown, { MenuItem } from "@/components/common/MenuDropdown";
import Modal from "@/components/common/Modal";
import MonthPickerSheet from "@/components/common/MonthPickerSheet";
import MonthSelectButton from "@/components/common/MonthSelectButton";
import PixelButton from "@/components/common/PixelButton";
import SortDropdown, { SortOption } from "@/components/common/SortDropdown";
import Toast from "@/components/common/Toast";
import WishAddContainer from "@/components/common/WishAddContainer";
import WishAddMenuDropdown from "@/components/common/WishAddMenuDropdown";
import WishCreateFolderModal from "@/components/wish/WishCreateFolderModal";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (!__DEV__) {
  // @ts-ignore — module-level early return for non-dev builds
  module.exports = { default: () => <Redirect href="/" /> };
}

const SORT_OPTIONS: SortOption<string>[] = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "금액 높은순", value: "price_desc" },
];

const MENU_ITEMS: MenuItem[] = [
  { label: "수정", onPress: () => {} },
  { label: "삭제", onPress: () => {} },
];

interface DemoFolder {
  id: string;
  title: string;
  images: string[];
}

const DEMO_ALL_FOLDER: DemoFolder = {
  id: "all",
  title: "전체 위시리스트",
  images: [
    "https://placehold.co/80x80",
    "https://placehold.co/80x80",
    "https://placehold.co/80x80",
    "https://placehold.co/80x80",
  ],
};

const DEMO_INITIAL_FOLDERS: DemoFolder[] = [
  { id: "1", title: "세일 중...", images: ["https://placehold.co/80x80"] },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export default function DevComponentsPage() {
  if (!__DEV__) return <Redirect href="/" />;

  const [alertVisible, setAlertVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [wishAddVisible, setWishAddVisible] = useState(false);
  const [wishAddContainerVisible, setWishAddContainerVisible] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [monthSheetVisible, setMonthSheetVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [demoFolders, setDemoFolders] = useState<DemoFolder[]>(DEMO_INITIAL_FOLDERS);

  const handleCreateDemoFolder = (name: string) => {
    setDemoFolders((prev) => [
      ...prev,
      { id: Date.now().toString(), title: name, images: [] },
    ]);
  };

  const handleRenameDemoFolder = (id: string, newTitle: string) => {
    setDemoFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title: newTitle } : f))
    );
  };
  const router = useRouter();
  const [sortValue, setSortValue] = useState("latest");
  const [inputValue, setInputValue] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>공통 컴퍼넌트</Text>

        {/* Button */}
        <Section title="Button — variant">
          <Row>
            <Button label="Primary" variant="primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Outline" variant="outline" />
          </Row>
        </Section>

        <Section title="Button — size">
          <Row>
            <Button label="Small" size="sm" />
            <Button label="Medium" size="md" />
            <Button label="Large" size="lg" />
          </Row>
        </Section>

        <Section title="Button — disabled">
          <Row>
            <Button label="Disabled" disabled />
          </Row>
        </Section>

        {/* Input */}
        <Section title="Input">
          <Input
            label="라벨 없음"
            placeholder="입력하세요"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Input
            label="라벨 있음"
            placeholder="입력하세요"
          />
          <Input
            label="에러 상태"
            placeholder="입력하세요"
            errorMessage="올바른 값을 입력해주세요."
          />
        </Section>

        {/* InsetShadow */}
        <Section title="InsetShadow">
          <InsetShadow
            borderRadius={8}
            style={styles.insetShadowDemo}
          >
            <Text style={styles.insetShadowText}>InsetShadow 예시</Text>
          </InsetShadow>
        </Section>

        {/* PixelButton */}
        <Section title="PixelButton">
          <Row>
            <PixelButton
              icon="heart-outline"
              label="위시"
              backgroundColor="#E8F9C7"
              accentColor="#9CCCA0"
              iconColor="#E67972"
              pressedIconColor="#A65D58"
            />
            <PixelButton
              icon="cart-outline"
              label="구매"
              backgroundColor="#E8F9C7"
              accentColor="#9CCCA0"
              iconColor="#5B8DEF"
              pressedIconColor="#3A6BC9"
            />
            <PixelButton
              icon="trash-outline"
              label="삭제"
              backgroundColor="#E8F9C7"
              accentColor="#9CCCA0"
              iconColor="#E67972"
              pressedIconColor="#A65D58"
            />
          </Row>
          <Row>
            <CustomizeHamsterButton adornment={require("@/assets/images/icons/adornment-icon.png")} />
          </Row>
        </Section>

        {/* MonthSelectButton */}
        <Section title="MonthSelectButton">
          <Row>
            <MonthSelectButton
              year={selectedYear}
              month={selectedMonth}
              onPress={() => setMonthSheetVisible(true)}
            />
          </Row>
          <MonthPickerSheet
            visible={monthSheetVisible}
            year={selectedYear}
            month={selectedMonth}
            onClose={() => setMonthSheetVisible(false)}
            onSelect={(y, m) => {
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
          />
        </Section>

        {/* DoneButton */}
        <Section title="DoneButton">
          <Row>
            <DoneButton onPress={() => {}} />
          </Row>
        </Section>

        {/* IconPixelButton */}
        <Section title="IconPixelButton">
          <Row>
            <IconPixelButton
              image={require("@/assets/images/icons/attendance-icon.png")}
              onPress={() => {}}
            />
          </Row>
        </Section>

        {/* LargePixelButton */}
        <Section title="LargePixelButton">
          <Row>
            <LargePixelButton
              label={"목표\n예산 설정"}
              image={require("@/assets/images/icons/money-bag.png")}
            />
          </Row>
        </Section>

        {/* ClothesButton */}
        <Section title="ClothesButton">
          <Row>
            <ClothesButton />
          </Row>
        </Section>

        {/* FloatingActionButton */}
        <Section title="FloatingActionButton">
          <Row>
            <FloatingActionButton
              image={require("@/assets/images/wish-button.png")}
              onPress={() => setFabVisible(true)}
            />
          </Row>
          <WishAddMenuDropdown
            visible={fabVisible}
            onClose={() => setFabVisible(false)}
            onLinkRegister={() => router.push("/wish/register-link")}
            onDirectRegister={() => router.push("/wish/register-direct")}
          />
        </Section>

        {/* Toast */}
        <Section title="Toast">
          <Button
            label="Toast 표시"
            variant="outline"
            onPress={() => setToastVisible(true)}
          />
          <Toast
            visible={toastVisible}
            message="저장되었습니다."
            onHide={() => setToastVisible(false)}
            bottom={80}
          />
        </Section>

        {/* AlertModal */}
        <Section title="AlertModal">
          <Button
            label="AlertModal 열기"
            variant="outline"
            onPress={() => setAlertVisible(true)}
          />
          <AlertModal
            visible={alertVisible}
            message="작업이 완료되었습니다."
            onConfirm={() => setAlertVisible(false)}
          />
        </Section>

        {/* ConfirmModal */}
        <Section title="ConfirmModal">
          <Button
            label="ConfirmModal 열기"
            variant="outline"
            onPress={() => setConfirmVisible(true)}
          />
          <ConfirmModal
            visible={confirmVisible}
            title="정말 삭제하시겠어요?"
            description="삭제한 항목은 복구할 수 없어요."
            onCancel={() => setConfirmVisible(false)}
            onConfirm={() => setConfirmVisible(false)}
          />
        </Section>

        {/* Modal */}
        <Section title="Modal (base)">
          <Button
            label="Modal 열기"
            variant="outline"
            onPress={() => setModalVisible(true)}
          />
          <Modal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title="모달 제목"
          >
            <Text style={styles.modalBody}>
              Modal 컴퍼넌트는 children을 자유롭게 구성할 수 있습니다.
            </Text>
            <Button
              label="닫기"
              variant="secondary"
              onPress={() => setModalVisible(false)}
            />
          </Modal>
        </Section>

        {/* MenuDropdown */}
        <Section title="MenuDropdown">
          <Button
            label="MenuDropdown 열기"
            variant="outline"
            onPress={() => setMenuVisible(true)}
          />
          <MenuDropdown
            visible={menuVisible}
            items={MENU_ITEMS}
            onClose={() => setMenuVisible(false)}
            anchorTop={300}
            anchorRight={24}
          />
        </Section>

        {/* SortDropdown */}
        <Section title="SortDropdown">
          <Text style={styles.hint}>선택됨: {sortValue}</Text>
          <Button
            label="SortDropdown 열기"
            variant="outline"
            onPress={() => setSortVisible(true)}
          />
          <SortDropdown
            visible={sortVisible}
            options={SORT_OPTIONS}
            selectedValue={sortValue}
            onSelect={(v) => setSortValue(v)}
            onClose={() => setSortVisible(false)}
            anchorTop={300}
            anchorRight={24}
          />
        </Section>

        {/* Wish Folder Grid */}
        <Section title="Wish Folder Grid (2x2)">
          <View style={styles.folderGrid}>
            <FolderCard
              title={DEMO_ALL_FOLDER.title}
              images={DEMO_ALL_FOLDER.images}
              onPress={() => {}}
            />
            <AddFolderButton onPress={() => setFolderModalVisible(true)} />
            {demoFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                title={folder.title}
                images={folder.images}
                onPress={() => {}}
                onTitleEdit={(newTitle) => handleRenameDemoFolder(folder.id, newTitle)}
              />
            ))}
          </View>
          <WishCreateFolderModal
            visible={folderModalVisible}
            onClose={() => setFolderModalVisible(false)}
            onCreate={handleCreateDemoFolder}
          />
        </Section>

        {/* WishAddContainer */}
        <Section title="WishAddContainer">
          <Row>
            <WishAddContainer onPress={() => setWishAddContainerVisible(true)} />
          </Row>
          <WishAddMenuDropdown
            visible={wishAddContainerVisible}
            onClose={() => setWishAddContainerVisible(false)}
            onLinkRegister={() => router.push("/wish/register-link")}
            onDirectRegister={() => router.push("/wish/register-direct")}
          />
        </Section>

        {/* WishAddMenuDropdown */}
        <Section title="WishAddMenuDropdown">
          <Button
            label="WishAddMenuDropdown 열기"
            variant="outline"
            onPress={() => setWishAddVisible(true)}
          />
          <WishAddMenuDropdown
            visible={wishAddVisible}
            onClose={() => setWishAddVisible(false)}
            onLinkRegister={() => router.push("/wish/register-link")}
            onDirectRegister={() => router.push("/wish/register-direct")}
          />
        </Section>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    padding: 20,
    gap: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B4112",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#757575",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  insetShadowDemo: {
    height: 72,
    backgroundColor: "#7EC985",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  insetShadowText: {
    color: "#0B4112",
    fontWeight: "600",
  },
  modalBody: {
    fontSize: 15,
    color: "#424242",
    lineHeight: 22,
  },
  hint: {
    fontSize: 13,
    color: "#9E9E9E",
  },
  bottomPad: {
    height: 40,
  },
  folderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: 11,
    rowGap: 16,
  },
});
