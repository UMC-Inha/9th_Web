import { create } from 'zustand'
import cartItemsData, { type CartItem } from '../constants/cartItems'

type CartStore = {
  cartItems: CartItem[]
  amount: number
  total: number
  isModalOpen: boolean
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  calculateTotals: () => void
  openModal: () => void
  closeModal: () => void
}

const recalcTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.amount, 0)
  return { amount, total }
}

export const useCartStore = create<CartStore>((set) => ({
  cartItems: cartItemsData,
  ...recalcTotals(cartItemsData),
  isModalOpen: false,
  increase: (id) =>
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      )
      const totals = recalcTotals(cartItems)
      return { ...state, cartItems, ...totals }
    }),
  decrease: (id) =>
    set((state) => {
      const existing = state.cartItems.find((item) => item.id === id)
      if (!existing) return state

      let cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item,
      )
      cartItems = cartItems.filter((item) => item.amount > 0)
      const totals = recalcTotals(cartItems)
      return { ...state, cartItems, ...totals }
    }),
  removeItem: (id) =>
    set((state) => {
      const cartItems = state.cartItems.filter((item) => item.id !== id)
      const totals = recalcTotals(cartItems)
      return { ...state, cartItems, ...totals }
    }),
  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),
  calculateTotals: () =>
    set((state) => {
      const totals = recalcTotals(state.cartItems)
      return { ...state, ...totals }
    }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))

