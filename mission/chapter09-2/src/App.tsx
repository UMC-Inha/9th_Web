// src/App.tsx
import { useAppSelector } from './app/hooks';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  return (
    <div className="relative min-h-screen bg-slate-100 py-10">
      <CartContainer />

      {/* 모달이 열렸을 때만 렌더링 */}
      {isOpen && <Modal />}
    </div>
  );
}

export default App;
