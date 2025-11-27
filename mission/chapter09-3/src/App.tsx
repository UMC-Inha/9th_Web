import CartContainer from './components/CartContainer';
import Modal from './components/Modal';
import { usePlaylistStore } from './store/playlistStore';

const App = () => {
  const isOpen = usePlaylistStore((state) => state.isOpen);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <CartContainer />
      {isOpen && <Modal />}
    </div>
  );
};

export default App;
