import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";
import { closeModal, openModal } from "../slices/modalSlice";
import Modal from "./Modal";

const TotalPrice = () => {
  const { total } = useSelector((state) => state.cart);
  const { isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const handleCart = () => {
    dispatch(clearCart());
  };

  const handleOpen = () => {
    dispatch(openModal());
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleClose = () => {
    dispatch(closeModal());
  };
  return (
    <div>
      <div className="p-10 flex justify-between items-center">
        <div className="flex flex-col gap-3">
          <button
            className="cursor-pointer border p-4 rounded-md transition-all duration-300 hover:bg-amber-200"
            onClick={handleCart}
          >
            장바구니 초기화
          </button>
          <button
            className="cursor-pointer border p-4 rounded-md transition-all duration-300 hover:bg-red-400"
            onClick={handleOpen}
          >
            전체 삭제
          </button>
        </div>
        <div className="border p-4 rounded-md bg-blue-300 mt-20">
          총 가격: {total}원
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
};

export default TotalPrice;
