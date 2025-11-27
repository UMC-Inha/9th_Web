import { useEffect } from 'react';
import CartItem from './CartItem';
import { usePlaylistStore } from '../store/playlistStore';

const CartContainer = () => {
  const {
    cartItems,
    amount,
    total,
    calculateTotals,
    openModal,
  } = usePlaylistStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  if (cartItems.length === 0)
    return <h2 className="text-center mt-10">장바구니가 비어 있습니다.</h2>;

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">장바구니</h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex flex-col items-end gap-2">
        <p>총 수량: {amount} 개</p>
        <p>총 금액: {total.toLocaleString()}원</p>

        <button
          className="px-4 py-2 border rounded"
          onClick={openModal}
        >
          전체 삭제
        </button>
      </div>
    </section>
  );
};

export default CartContainer;
