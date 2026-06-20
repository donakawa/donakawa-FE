import ConfirmModal from "@/components/common/ConfirmModal";

interface SimpleModalProps {
  visible: boolean;
  title: string;
  description: string;
  danger?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SimpleModal({
  visible,
  title,
  description,
  danger,
  cancelLabel = "아니오",
  confirmLabel,
  onCancel,
  onConfirm,
}: SimpleModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      title={title}
      description={description}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel ?? (danger ? "탈퇴" : "네")}
      danger={danger}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
