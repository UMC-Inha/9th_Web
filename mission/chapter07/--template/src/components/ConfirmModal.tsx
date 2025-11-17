type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "예",
  cancelText = "아니오",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {/* 배경 클릭 시 닫힘 */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onCancel} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-5 text-white shadow-xl"
          onClick={stop}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-300">{message}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

