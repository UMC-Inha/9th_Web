import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HomePage = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return null;
  }

  const { state } = context;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`flex items-center justify-center rounded-full size-150 border border-black transition-all duration-300 ${
          state.mode === "light" ? "bg-white" : "bg-black"
        }`}
      >
        <span className="flex items-center justify-center font-extrabold text-xl">
          Hello
        </span>
      </div>
    </div>
  );
};

export default HomePage;
