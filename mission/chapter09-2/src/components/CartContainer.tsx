// src/components/CartContainer.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CartItem from './CartItem';
import { calculateTotals } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  if (cartItems.length === 0) {
    return <h2 className="text-xl text-center mt-10">장바구니가 비어 있습니다.</h2>;
  }

  return (
    <section className="bg-white rounded-2xl p-4 shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">장바구니</h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t pt-4 mt-6 flex flex-col items-end gap-2">
        <p>총 수량: {amount} 개</p>
        <p>총 금액: {total.toLocaleString()}원</p>

        {/* clearCart → openModal로 변경 */}
        <button
          className="px-4 py-2 border rounded-lg hover:bg-slate-100"
          onClick={() => dispatch(openModal())}
        >
          전체 삭제
        </button>
      </div>
    </section>
  );
};

export default CartContainer;
