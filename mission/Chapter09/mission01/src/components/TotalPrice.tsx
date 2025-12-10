import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";

const TotalPrice = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleCart = () => {
    dispatch(clearCart());
  };
  return (
    <div className="p-10 flex justify-between">
      <button
        className="cursor-pointer border p-4 rounded-md transition-all duration-300 hover:bg-amber-200"
        onClick={handleCart}
      >
        장바구니 초기화
      </button>
      <div className="border p-4 rounded-md">총 가격: {total}원</div>
    </div>
  );
};

export default TotalPrice;
