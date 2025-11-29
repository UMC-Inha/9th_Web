import "./App.css";
import CartList from "./components/CartList";
import Navbar from "./components/Navbar";
import PriceBox from "./components/PriceBox";
import Modal from "./components/Modal";
import { useSelector } from "./hooks/useCustomRedux";
function App() {
  const { isOpen } = useSelector((state) => state.modal);
  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />}
    </>
  );
}

export default App;
