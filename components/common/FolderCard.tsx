import { useRef, useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FolderImageSource = ImageSourcePropType | string;

interface FolderCardProps {
  title: string;
  images?: FolderImageSource[];
  onPress?: () => void;
  onTitleEdit?: (newTitle: string) => void;
}

const CELL = 80;

const toImageSource = (source: FolderImageSource): ImageSourcePropType =>
  typeof source === "string" ? { uri: source } : source;

export default function FolderCard({ title, images = [], onPress, onTitleEdit }: FolderCardProps) {
  const cells = Array.from({ length: 4 }, (_, i) => images[i] ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<TextInput>(null);

  const cellStyle = (index: number) => {
    const radius: Record<string, number> = {};
    if (index === 0) radius.borderTopLeftRadius = 5;
    if (index === 1) radius.borderTopRightRadius = 5;
    if (index === 2) radius.borderBottomLeftRadius = 5;
    if (index === 3) radius.borderBottomRightRadius = 5;
    return radius;
  };

  const handleTitlePress = () => {
    if (!onTitleEdit) return;
    setDraft(title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (trimmed) onTitleEdit?.(trimmed);
    setIsEditing(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={styles.grid}>
          {cells.map((source, i) => (
            <View key={i} style={[styles.cell, cellStyle(i)]}>
              {source ? (
                <Image source={toImageSource(source)} style={[styles.cell, cellStyle(i)]} />
              ) : (
                <View style={[styles.cell, styles.placeholder, cellStyle(i)]} />
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          ref={inputRef}
          style={styles.titleInput}
          value={draft}
          onChangeText={setDraft}
          onBlur={handleSubmit}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          maxLength={30}
        />
      ) : (
        <TouchableOpacity onPress={handleTitlePress} activeOpacity={onTitleEdit ? 0.6 : 1}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 162,
    gap: 8,
  },
  grid: {
    width: CELL * 2 + 2,
    height: CELL * 2 + 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    backgroundColor: "#F5FAF6",
    borderRadius: 5,
    overflow: "hidden",
  },
  cell: {
    width: CELL,
    height: CELL,
  },
  placeholder: {
    backgroundColor: "#DCE1DD",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    color: "#2D322E",
  },
  titleInput: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    color: "#2D322E",
    borderBottomWidth: 1,
    borderBottomColor: "#7EC985",
    paddingVertical: 0,
  },
});
