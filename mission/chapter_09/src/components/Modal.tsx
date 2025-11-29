import { useDispatch } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";

const Modal = () => {
  const dispatch = useDispatch();

  const handleNo = () => {
    dispatch(closeModal());
  };

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 z-10">
        <h2 className="text-2xl font-bold mb-4">장바구니 비우기</h2>
        <p className="text-gray-600 mb-6">
          정말로 장바구니의 모든 상품을 삭제하시겠습니까?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleNo}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleYes}
            className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
