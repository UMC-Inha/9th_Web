import React, { createContext, useReducer } from "react";
import { Reducer, type IAction, type IState } from "./Reducer";

export const ThemeContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
} | null>(null);

const initialState: IState = {
  mode: "light",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}
