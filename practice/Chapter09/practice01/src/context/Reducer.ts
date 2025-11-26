export interface IState {
  mode: "light" | "dark";
}

export interface IAction {
  type: "toggle";
}

export function Reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "toggle":
      return {
        ...state,
        mode: state.mode === "light" ? "dark" : "light",
      };
    default:
      return state;
  }
}
