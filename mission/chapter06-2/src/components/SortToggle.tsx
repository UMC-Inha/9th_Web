interface SortToggleProps {
  sort: "latest" | "oldest";
  onToggle: () => void;
}

export const SortToggle = ({ sort, onToggle }: SortToggleProps) => {
  return (
    <div className="sort-toggle">
      <button onClick={onToggle}>
        {sort === "latest" ? "🕒 최신순" : "📜 오래된순"}
      </button>
    </div>
  );
};
