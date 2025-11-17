type Props = { onClick: () => void };

export default function Fab({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 h-12 w-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-2xl leading-[48px] shadow-lg"
      aria-label="새 글 작성"
      title="새 글 작성"
    >
      +
    </button>
  );
}
