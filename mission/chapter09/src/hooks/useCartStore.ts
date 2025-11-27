import { create } from 'zustand';
import { cartItems } from '../constants/cardItem';

interface CartItem {
    id: string;
    title: string;
    singer: string;
    price: string; 
    img: string;
    amount: number;
}

interface CartState {
    items: CartItem[];
    amount: number;
    total: number;
    isOpen: boolean; 
}

interface CartActions {
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotals: () => void;
    openModal: () => void;
    closeModal: () => void;
}

type CartStore = CartState & CartActions;

const getTotals = (items: CartItem[]) => {
    let amount = 0;
    let total = 0;

    items.forEach((item) => {
        const itemAmount = item.amount;
        const itemPrice = Number(item.price); 
        
        amount += itemAmount;
        total += itemAmount * itemPrice;
    });

    return { amount, total };
};

const initialTotals = getTotals(cartItems as CartItem[]);

export const useCartStore = create<CartStore>((set, get) => ({
    items: cartItems as CartItem[], 
    amount: initialTotals.amount,
    total: initialTotals.total,
    isOpen: false,

    increase: (id) => set((state) => {
        const newItems = state.items.map(item => 
            item.id === id ? { ...item, amount: item.amount + 1 } : item
        );
        const { amount, total } = getTotals(newItems);

        return { items: newItems, amount, total };
    }),

    decrease: (id) => set((state) => {
        let newItems = state.items.map(item => 
            item.id === id ? { ...item, amount: item.amount - 1 } : item
        );
        
        newItems = newItems.filter(item => item.amount > 0);

        const { amount, total } = getTotals(newItems);

        return { items: newItems, amount, total };
    }),

    removeItem: (id) => set((state) => {
        const newItems = state.items.filter(item => item.id !== id);
        const { amount, total } = getTotals(newItems);

        return { items: newItems, amount, total };
    }),

    clearCart: () => set(() => ({
        items: [],
        amount: 0,
        total: 0,
    })),

    calculateTotals: () => set((state) => {
        const { amount, total } = getTotals(state.items);
        
        return { amount, total };
    }),

    openModal: () => set({ isOpen: true }),

    closeModal: () => set({ isOpen: false }),
}));