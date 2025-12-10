import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const ToggleButton = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    return null;
  }

  const { dispatch } = context;

  return (
    <button
      onClick={() => dispatch({ type: "toggle" })}
      className="cursor-pointer mt-20 rounded-2xl font-extrabold bg-blue-400 p-3 hover:bg-amber-500 transition-all duration-300"
    >
      난 토글 버튼이야
    </button>
  );
};
