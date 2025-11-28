import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../../constants/cartItems'
import cartItems from '../../constants/cartItems'

type CartState = {
  cartItems: CartItem[]
  amount: number
  total: number
}

const recalcTotals = (state: CartState) => {
  state.amount = state.cartItems.reduce((sum, item) => sum + item.amount, 0)
  state.total = state.cartItems.reduce((sum, item) => sum + item.price * item.amount, 0)
}

const initialState: CartState = {
  cartItems,
  amount: cartItems.reduce((sum, item) => sum + item.amount, 0),
  total: cartItems.reduce((sum, item) => sum + item.price * item.amount, 0),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (item) {
        item.amount += 1
        recalcTotals(state)
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (!item) return

      item.amount -= 1
      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
      }
      recalcTotals(state)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
      recalcTotals(state)
    },
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
    calculateTotals: (state) => {
      recalcTotals(state)
    },
  },
})

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions

export default cartSlice.reducer