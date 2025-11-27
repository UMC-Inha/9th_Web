// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cartItems, { CartItem } from '../../constants/cartItems';

interface CartState {
  cartItems: CartItem[];
  amount: number; // 전체 수량
  total: number;  // 전체 금액
}

// cartItems 로부터 초기 합계 계산
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
      if (item) {
        item.amount += 1;
      }
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
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const { amount, total } = calcTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
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
