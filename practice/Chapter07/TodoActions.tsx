import { createTodo } from "./TodoList";

export const TodoActions = () => {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const create = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
    onError: (error) => {
      console.error("create 실패:", error);
    },
  });

  const handleCreate = () => {
    if (title.trim()) {
      create.mutate({ title: title.trim(), completed: false });
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>새로운 할 일 추가</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일 내용..."
        disabled={create.isPending}
      />
      <button
        onClick={handleCreate}
        disabled={create.isPending || !title.trim()}
      >
        추가
      </button>

      {create.isError && (
        <div style={{ color: "red" }}>{create.error.message}</div>
      )}
    </div>
  );
};
