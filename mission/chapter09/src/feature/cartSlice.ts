import { createSlice } from "@reduxjs/toolkit";
import { cartItems } from "../constants/cardItem";

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        items: cartItems,
        amount: cartItems.reduce((total, item) => total + item.amount, 0),
        total: 0, 
    },

    reducers: {
        increase: (state, action) => {
            const item = state.items.find((i: { id: any; }) => i.id === action.payload);

            if (item) {
                item.amount += 1;
            }
        },

        decrease: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find((i: { id: any; }) => i.id === itemId);

            if (item) {
                item.amount -= 1;
                
                if (item.amount === 0) {
                    state.items = state.items.filter((i: { id: any; }) => i.id !== itemId);
                }
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.amount = 0;
            state.total = 0;
        }
    },
});

export const { increase, decrease, clearCart } = cartSlice.actions;

export default cartSlice.reducer;