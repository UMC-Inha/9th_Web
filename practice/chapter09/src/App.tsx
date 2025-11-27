import { useReducer } from "react";

type State = {
    count: number;
};

type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset" };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "increment":
        return { count: state.count + 1 };
        case "decrement":
        return { count: state.count - 1 };
        case "reset":
        return { count: 0 };
        default:
        return state;
    }
};

export default function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div style={{ padding: 20 }}>
            <h2> useReducer 실습 </h2>
            <p> Count: {state.count} </p>

            <button onClick={() => dispatch({ type: "increment" })}> + </button>
            <button onClick={() => dispatch({ type: "decrement" })}> - </button>
            <button onClick={() => dispatch({ type: "reset" })}> Reset </button>
        </div>
    );
}
