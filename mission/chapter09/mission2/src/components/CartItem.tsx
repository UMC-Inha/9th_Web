import { useAppDispatch } from '../app/hooks'
import type { CartItem as CartItemType } from '../constants/cartItems'
import { decrease, increase, removeItem } from '../features/cart/cartSlice'

interface Props {
  item: CartItemType
}

const CartItem = ({ item }: Props) => {
  const dispatch = useAppDispatch()
  const { id, title, singer, price, img, amount } = item

  return (
    <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6">
      <img src={img} alt={title} className="h-24 w-24 rounded-xl object-cover shadow-sm" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{singer}</p>
        <p className="mt-2 text-base font-semibold text-slate-800">{price.toLocaleString()}원</p>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 text-slate-900">
          <button
            onClick={() => dispatch(decrease(id))}
            className="px-3 py-1 text-lg font-bold transition hover:text-pink-500"
          >
            -
          </button>
          <div className="px-4 text-sm font-semibold">{amount}</div>
          <button
            onClick={() => dispatch(increase(id))}
            className="px-3 py-1 text-lg font-bold transition hover:text-pink-500"
          >
            +
          </button>
        </div>
        <button
          onClick={() => dispatch(removeItem(id))}
          className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
        >
          삭제
        </button>
      </div>
    </li>
  )
}

export default CartItem