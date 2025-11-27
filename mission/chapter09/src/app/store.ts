import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../feature/cartSlice";
import modalSlice from "../feature/modalSlice";

export const store = configureStore({
    reducer: {
        cart: cartSlice,
        modal: modalSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;