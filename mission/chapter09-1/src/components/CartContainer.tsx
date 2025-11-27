// src/components/CartContainer.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CartItem from './CartItem';
import {
  calculateTotals,
  clearCart,
} from '../features/cart/cartSlice';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  // cartItems 변경될 때마다 합계 재계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length === 0) {
    return (
      <section className="mt-10 text-center">
        <h2 className="text-xl font-semibold mb-2">장바구니가 비어 있습니다.</h2>
        <p className="text-sm text-slate-500">
          마음에 드는 음반을 추가해 보세요!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 rounded-2xl shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">장바구니</h2>

      {/* 🔥 핵심: CartItem을 사용해야 버튼/이미지 UI가 나타난다 */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* 총합 + 전체삭제 */}
      <div className="mt-6 border-t pt-4 flex flex-col items-end gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm sm:text-base">
          <span>
            총 수량: <span className="font-semibold">{amount}</span> 개
          </span>
          <span>
            총 금액:{' '}
            <span className="font-semibold">
              {total.toLocaleString()}원
            </span>
          </span>
        </div>

        <button
          className="px-5 py-2 border border-slate-500 rounded-lg text-sm sm:text-base hover:bg-slate-900 hover:text-white transition"
          onClick={() => dispatch(clearCart())}
        >
          전체 삭제
        </button>
      </div>
    </section>
  );
};

export default CartContainer;
