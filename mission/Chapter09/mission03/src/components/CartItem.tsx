import { useCartActions } from "../hooks/useCartStore";
import type { Lp } from "../types/cart";

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const { increase, decrease, removeItem } = useCartActions();

  const handleIncrease = () => {
    increase(lp.id);
  };

  const handleDecrease = () => {
    if (lp.amount === 1) {
      removeItem(lp.id);
    }

    decrease(lp.id);
  };

  return (
    <div className="flex items-center p-4 border-b border-black">
      <img
        src={lp.img}
        alt="LP 이미지"
        className="w-20 h-20 object-cover rounded-full mr-4 border border-black"
      />
      <div className="flex-1">
        <h3 className="text-xl">{lp.title}</h3>
        <p className="text-sm text-gray-600">{lp.singer}</p>

        <p className="text-sm text-gray-600 mt-2">{lp.price}원</p>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="cursor-pointer hover:bg-gray-300 p-2 transition-all duration-300 rounded-t-3xl"
          onClick={handleDecrease}
        >
          -
        </button>
        <span className="p-2">{lp.amount}</span>
        <button
          className="cursor-pointer hover:bg-gray-300 p-2 transition-all duration-300 rounded-b-3xl"
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
