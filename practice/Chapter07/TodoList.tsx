export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const createTodo = async (
  payload: Pick<Todo, "title" | "completed">
): Promise<Todo> => {
  const newTodo: Todo = {
    id: Math.floor(Math.random() * 1000),
    title: payload.title,
    completed: payload.completed,
  };

  return Promise.resolve(newTodo);
};

export const deleteTodo = async (
  id: number
): Promise<{ success: boolean; id: number }> => {
  const fakeResponse = {
    success: true,
    id: id,
  };
  return Promise.resolve(fakeResponse);
};

const FAKE_DB: Todo[] = [
  { id: 1, title: "React Query 공부하기", completed: true },
  { id: 2, title: "useMutation 공부하기", completed: false },
];

const fetchTodos = async (): Promise<Todo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(FAKE_DB);
};

export const TodoList = () => {
  const qc = useQueryClient();

  const {
    data: todos,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
