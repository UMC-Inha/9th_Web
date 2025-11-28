import CartItem from './CartItem'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const { cartItems, amount, total, openModal } = useCartStore((state) => ({
    cartItems: state.cartItems,
    amount: state.amount,
    total: state.total,
    openModal: state.openModal,
  }))

  if (cartItems.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-10 text-center shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-800">장바구니</h2>
        <p className="mt-6 text-lg text-slate-500">장바구니가 비어있습니다.</p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg sm:p-10">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">Selected Albums</p>
          <h2 className="text-3xl font-semibold text-slate-900">장바구니</h2>
        </div>
        <div className="text-sm text-slate-500">
          <div className="flex items-center gap-2 text-base text-slate-800">
            <span className="font-semibold">총 수량</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{amount}</span>
          </div>
          <p className="mt-1 text-xl font-bold text-slate-900">{total.toLocaleString()}원</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={openModal}
          className="w-full rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold tracking-wide text-slate-900 transition hover:bg-slate-900 hover:text-white sm:w-1/3"
        >
          전체 삭제
        </button>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">감상은 비움에서 시작됩니다</p>
      </div>
    </section>
  )
}
