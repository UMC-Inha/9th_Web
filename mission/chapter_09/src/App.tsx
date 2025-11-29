import "./App.css";
import CartList from "./components/CartList";
import Navbar from "./components/Navbar";
import PriceBox from "./components/PriceBox";
import Modal from "./components/Modal";
import { useModalInfo } from "./hooks/useCartStore";

function App() {
  const isModalOpen = useModalInfo();

  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isModalOpen && <Modal />}
    </>
  );
}

export default App;
