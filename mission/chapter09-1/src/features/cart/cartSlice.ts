// src/features/cart/cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';
import type { CartItem } from '../../constants/cartItems';

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

const calcTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      const price = Number(item.price);
      acc.amount += item.amount;
      acc.total += item.amount * price;
      return acc;
    },
    { amount: 0, total: 0 }
  );
};

const { amount, total } = calcTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount,
  total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) item.amount++;

      const totals = calcTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },

    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (!item) return;

      item.amount -= 1;

      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload
        );
      }

      const totals = calcTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );

      const totals = calcTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    // 필요 없는 경우 제거 가능하지만 일단 유지
    calculateTotals: (state) => {
      const totals = calcTotals(state.cartItems);
      state.amount = totals.amount;
      state.total = totals.total;
    },
  },
});

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
