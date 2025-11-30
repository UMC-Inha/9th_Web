// src/store/playlistStore.ts
import { create } from 'zustand';
import cartItemsData, { type CartItem } from '../constants/cartItems';

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

  // 내부 계산 함수
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
  increase: (id) => {
    set((state) => {
      const updated = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return { cartItems: updated };
    });

    get().calculateTotals();
  },

  decrease: (id) => {
    set((state) => {
      const updated = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0);
      return { cartItems: updated };
    });

    get().calculateTotals();
  },

  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));

    get().calculateTotals();
  },

  clearCart: () =>
    set(() => ({
      cartItems: [],
      amount: 0,
      total: 0,
    })),

  // 🔍 합계 계산 - 모든 action이 공통적으로 호출
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
