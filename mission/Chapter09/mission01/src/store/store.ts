import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "../slices/cartSlice";

function createStore() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  return store;
}

// store 내보내기
const store = createStore();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
