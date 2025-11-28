import { useReducer, useState, type JSX } from "react";

// 1. state 에 대한 interface
interface IState {
  counter: number;
}

// 2. reducer 에 대한 interface
interface IAction {
  type: "INCREASE" | "DECREASE" | "RESET_TO_ZERO";
}

function reducer(state: IState, action: IAction): IState {
  const { type } = action;
  console.log(state);
  
  switch (type) {
    case "INCREASE": {
      return {
        ...state,
        counter: state.counter + 1,
      };
    }
    case "DECREASE": {
      return {
        counter: state.counter - 1,
      };
    }
    case "RESET_TO_ZERO": {
      return {
        counter: 0,
      };
    }
    default:
      return state;
  }
}

export default function App(): JSX.Element {
  // 1. useState
  const [count, setCount] = useState(0);

  // 2. useReducer
  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
  });

  const handleIncrease = (): void => {
    setCount(count + 1);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-3xl">useState</h2>
        <h2 className="text-3xl">useState 훅 사용 : {count}</h2>
        <button onClick={handleIncrease}>Increase</button>
      </div>

      <div>
        <h2 className="text-3xl">useReducer</h2>
        <h2 className="text-3xl">useReducer 훅 사용 : {state.counter}</h2>
        <div className="flex gap-2">
          <button onClick={() => dispatch({ type: "INCREASE" })}>
            +1
          </button>
          <button onClick={() => dispatch({ type: "DECREASE" })}>
            -1
          </button>
          <button onClick={() => dispatch({ type: "RESET_TO_ZERO" })}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
