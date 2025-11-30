import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const calculateInitialTotals = (items: CartItems) => {
  let amount = 0;
  let total = 0;
  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * item.price;
  });
  return { amount, total };
};
const initialTotals = calculateInitialTotals(cartItems);

const initialState: CartState = {
  cartItems: cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if (item) item.amount++;
      cartSlice.caseReducers.calculateTotals(state);
    },
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if (item) {
        item.amount--;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== itemId
          );
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== itemId
      );
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});
export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
const cartReducer = cartSlice.reducer;

export default cartReducer;
