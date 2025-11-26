import "./App.css";
import { ToggleButton } from "./component/ToggleButton";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <ToggleButton />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
