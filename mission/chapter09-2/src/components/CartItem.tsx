// src/components/CartItem.tsx
import type { CartItem as CartItemType } from '../constants/cartItems';
import { useAppDispatch } from '../app/hooks';
import {
  increase,
  decrease,
  removeItem,
} from '../features/cart/cartSlice';

interface Props {
  item: CartItemType;
}

const CartItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();
  const { id, title, singer, img, price, amount } = item;

  return (
    <article className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-3">
      {/* 이미지 */}
      <img
        src={img}
        alt={title}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
      />

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base truncate">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 truncate">
          {singer}
        </p>
        <p className="mt-1 text-sm sm:text-base font-semibold">
          ₩{Number(price).toLocaleString()}
        </p>

        <button
          className="mt-1 text-xs text-red-500 hover:underline"
          onClick={() => dispatch(removeItem(id))}
        >
          제거
        </button>
      </div>

      {/* 수량 조절 버튼 */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-lg hover:bg-slate-100"
          onClick={() => dispatch(decrease(id))}
        >
          -
        </button>
        <span className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-sm bg-slate-50">
          {amount}
        </span>
        <button
          className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-lg hover:bg-slate-100"
          onClick={() => dispatch(increase(id))}
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;
