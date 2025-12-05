import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { calculateTotals } from './features/cart/cartSlice';
import CartList from './components/CartList';
import Modal from './components/Modal';

const App = () => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CartList />
      </main>

      <Footer />
      <Modal />
    </div>
  );
};

export default App;