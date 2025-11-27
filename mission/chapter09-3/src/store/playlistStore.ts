// src/store/playlistStore.ts
import { create } from 'zustand';
import cartItemsData, { CartItem } from '../constants/cartItems';

interface PlaylistStoreState {
  cartItems: CartItem[];
  amount: number;
  total: number;

  // modal
  isOpen: boolean;

  // cart functions
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // modal functions
  openModal: () => void;
  closeModal: () => void;
}

export const usePlaylistStore = create<PlaylistStoreState>((set, get) => ({
  cartItems: cartItemsData,
  amount: 0,
  total: 0,

  // modal
  isOpen: false,

  // cart actions
  increase: (id) =>
    set((state) => {
      const updated = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return { cartItems: updated };
    }),

  decrease: (id) =>
    set((state) => {
      const updated = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0);
      return { cartItems: updated };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () =>
    set(() => ({
      cartItems: [],
      amount: 0,
      total: 0,
    })),

  calculateTotals: () => {
    const { cartItems } = get();
    let amount = 0;
    let total = 0;

    cartItems.forEach((item) => {
      amount += item.amount;
      total += Number(item.price) * item.amount;
    });

    set({ amount, total });
  },

  // modal actions
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
