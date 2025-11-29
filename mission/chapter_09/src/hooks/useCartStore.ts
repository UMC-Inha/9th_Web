import type { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import cartItems from "../constants/cartItems";

// 초기값 계산 함수
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

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

interface ModalActions {
  openModal: () => void;
  closeModal: () => void;
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  isModalOpen: boolean;
  actions: CartActions & ModalActions;
}

export const useCartStore = create<CartState>()(
  immer((set) => ({
    cartItems: cartItems,
    amount: initialTotals.amount,
    total: initialTotals.total,
    isModalOpen: false,
    actions: {
      increase: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem) {
            cartItem.amount += 1;
          }
        });
      },
      decrease: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem) {
            cartItem.amount -= 1;
            // 감소 결과가 1보다 작아지면 자동 제거
            if (cartItem.amount < 1) {
              state.cartItems = state.cartItems.filter(
                (item) => item.id !== id
              );
            }
          }
        });
      },
      removeItem: (id: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        });
      },
      clearCart: () => {
        set((state) => {
          state.cartItems = [];
          state.amount = 0;
          state.total = 0;
        });
      },
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          state.amount = amount;
          state.total = total;
        });
      },
      openModal: () => {
        set((state) => {
          state.isModalOpen = true;
        });
      },
      closeModal: () => {
        set((state) => {
          state.isModalOpen = false;
        });
      },
    },
  }))
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useModalInfo = () => useCartStore((state) => state.isModalOpen);

export const useCartActions = () => useCartStore((state) => state.actions);
