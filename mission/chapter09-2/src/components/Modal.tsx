// src/components/Modal.tsx
import { useAppDispatch } from '../app/hooks';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

const Modal = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</h2>

        <div className="flex justify-between mt-6">
          {/* 아니요 버튼 */}
          <button
            className="px-4 py-2 border rounded-lg hover:bg-slate-100"
            onClick={() => dispatch(closeModal())}
          >
            아니요
          </button>

          {/* 네 버튼 */}
          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
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
