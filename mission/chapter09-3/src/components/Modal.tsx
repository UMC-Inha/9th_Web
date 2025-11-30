import { usePlaylistStore } from '../store/playlistStore';

const Modal = () => {
  const { clearCart, closeModal } = usePlaylistStore();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">정말 삭제할까요?</h2>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 border rounded"
            onClick={closeModal}
          >
            아니요
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              clearCart();
              closeModal();
            }}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
