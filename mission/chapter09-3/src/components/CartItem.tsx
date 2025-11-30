import { CartItem as CartItemType } from '../constants/cartItems';
import { usePlaylistStore } from '../store/playlistStore';

interface Props {
  item: CartItemType;
}

const CartItem = ({ item }: Props) => {
  const { increase, decrease, removeItem } = usePlaylistStore();
  const { id, title, singer, img, price, amount } = item;

  return (
    <article className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-3">
      <img src={img} alt={title} className="w-16 h-16 rounded-lg" />

      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-slate-500">{singer}</p>
        <p className="font-semibold mt-1">₩{Number(price).toLocaleString()}</p>

        <button
          className="text-sm text-red-500 mt-1"
          onClick={() => removeItem(id)}
        >
          제거
        </button>
      </div>

      {/* 버튼 */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 border rounded"
          onClick={() => decrease(id)}
        >
          -
        </button>

        <span className="w-8 h-8 border rounded flex items-center justify-center">
          {amount}
        </span>

        <button
          className="w-8 h-8 border rounded"
          onClick={() => increase(id)}
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;
