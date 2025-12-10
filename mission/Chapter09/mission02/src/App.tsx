import "./App.css";
import CartList from "./components/CartList";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./store/store";
import TotalPrice from "./components/TotalPrice";

function App() {
  return (
    <Provider store={store}>
      <div className="bg-linear-to-r from-gray-400 to-gray-300 min-h-screen">
        <Navbar />
        <CartList />
        <TotalPrice />
      </div>
    </Provider>
  );
}

export default App;
