import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const Id = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === Id);

      if (item) {
        item.amount++;
      }
    },

    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const Id = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === Id);

      if (item) {
        item.amount--;
      }
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const Id = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== Id
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total = item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, calculateTotals, clearCart } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
