import "./App.css";
import CartList from "./components/CartList";
import Navbar from "./components/Navbar";
import TotalPrice from "./components/TotalPrice";

function App() {
  return (
    <div className="bg-linear-to-r from-gray-400 to-gray-300 min-h-screen">
      <Navbar />
      <CartList />
      <TotalPrice />
    </div>
  );
}

export default App;
