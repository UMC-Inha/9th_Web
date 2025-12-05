import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearCart } from '../features/cart/cartSlice'
import { closeModal } from '../features/modal/modalSlice'

const Modal = () => {
  const dispatch = useAppDispatch()
  const { isOpen } = useAppSelector((state) => state.modal)

  if (!isOpen) return null

  const handleConfirm = () => {
    dispatch(clearCart())
    dispatch(closeModal())
  }

  const handleCancel = () => {
    dispatch(closeModal())
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">장바구니를 비울까요?</h3>
        <p className="mt-3 text-sm text-slate-500">삭제 후에는 다시 되돌릴 수 없습니다.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            네
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

