import { useReducer, useState, type ChangeEvent, type JSX } from "react";

interface IState {
  department: string;
  error: string | null;
}

type IAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string }
  | { type: "RESET" };

const initialState: IState = {
  department: "",
  error: null,
};

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "CHANGE_DEPARTMENT": {
      const payload = "payload" in action ? action.payload : "";
      if (!payload || !payload.trim()) {
        return { ...state, error: "부서명을 입력해주세요." };
      }
      return { department: payload, error: null };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function UseReducerCompany(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");

  // 🔹 잘못됐던 부분 고친 핸들러
  const handleChangeDepartment = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setInput(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">회사 부서 변경 (useReducer)</h1>

      <div className="mb-4">
        <input
          value={input}
          onChange={handleChangeDepartment} // 여기서 사용
          placeholder="부서명 입력"
          className="border p-2 mr-2"
        />
        <button
          onClick={() =>
            dispatch({ type: "CHANGE_DEPARTMENT", payload: input })
          }
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          변경
        </button>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="ml-2 px-3 py-1 bg-gray-200 rounded"
        >
          초기화
        </button>
      </div>

      <div>
        <h2 className="text-xl">
          현재 부서: {state.department || "미지정"}
        </h2>
        {state.error && (
          <p className="text-red-500 mt-2">{state.error}</p>
        )}
      </div>
    </div>
  );
}

