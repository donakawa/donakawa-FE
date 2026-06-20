import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface MoveFolderOption {
  id: string;
  title: string;
}

interface WishMoveFolderSheetProps {
  visible: boolean;
  folders: MoveFolderOption[];
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
  onClose: () => void;
  onComplete: () => void;
  onCreateFolder?: () => void;
}

export default function WishMoveFolderSheet({
  visible,
  folders,
  selectedFolderId,
  onSelectFolder,
  onClose,
  onComplete,
  onCreateFolder,
}: WishMoveFolderSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.content}>
            <View style={styles.handle} />

            <View style={styles.body}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.previousText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={onComplete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.completeText}>완료</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.folderList}>
                <TouchableOpacity
                  style={styles.createRow}
                  onPress={onCreateFolder}
                  activeOpacity={0.8}
                >
                  <Text style={styles.folderTitle}>새 폴더 추가</Text>
                  <Ionicons name="add" size={24} color="#2D322E" />
                </TouchableOpacity>

                {folders.map((folder) => {
                  const isSelected = folder.id === selectedFolderId;

                  return (
                    <TouchableOpacity
                      key={folder.id}
                      style={styles.folderRow}
                      onPress={() => onSelectFolder(folder.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.folderTitle}>{folder.title}</Text>
                      <View style={styles.radioWrap}>
                        <View style={styles.radioCircle}>
                          {isSelected ? (
                            <Image
                              source={require("@/assets/images/wish/check-icon.png")}
                              style={styles.checkIcon}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.20)",
  },
  sheet: {
    height: 383,
    paddingTop: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FAFFF9",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: "0px -4px 10px rgba(138, 167, 100, 0.30)",
    elevation: 8,
  },
  content: {
    width: "100%",
    alignItems: "center",
    gap: 5,
  },
  handle: {
    width: 116,
    height: 3,
    backgroundColor: "#919692",
    borderRadius: 100,
  },
  body: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 16,
  },
  header: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  previousText: {
    textAlign: "center",
    color: "#464B47",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  completeText: {
    textAlign: "center",
    color: "#7EC985",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  folderList: {
    width: "100%",
    maxWidth: 335,
    gap: 8,
  },
  createRow: {
    height: 48,
    paddingLeft: 16,
    paddingRight: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F9C7",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  folderRow: {
    height: 48,
    paddingLeft: 16,
    paddingRight: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5FAF6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  folderTitle: {
    color: "#2D322E",
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    lineHeight: 21,
  },
  radioWrap: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircle: {
    width: 25,
    height: 25,
    borderRadius: 9999,
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "-2px 2px 2px #BFD8B8 inset",
  },
  checkIcon: {
    width: 23,
    height: 23,
  },
});
