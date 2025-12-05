import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartList from './components/CartList';
import Modal from './components/Modal';
import { useCartStore } from './store/cartStore';

const App = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const calculateTotals = useCartStore((state) => state.calculateTotals);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

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