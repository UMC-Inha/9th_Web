// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import modalReducer from '../features/modal/modalSlice';


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,   // ← 추가
  },
});

// RootState & AppDispatch 타입
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
