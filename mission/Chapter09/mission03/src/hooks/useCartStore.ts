import type { CartItems } from "../types/cart";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/react/shallow";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  actions: CartActions;
}

export const useCartStore = create<CartState>()(
  // immer를 적용하면 set 내부에서 draft state 제공
  // draft에 직접 수정하면, immer가 내부적으로 불변성 보장
  immer((set, _) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    // 상태 변경은 actions 내부에 직접 작성
    actions: {
      increase: (id: string) => {
        set((state) => {
          const Item = state.cartItems.find((item) => item.id === id);
          if (Item) {
            // immer가 해당 변경을 새로운 객체 구조로 복사해서 반환
            Item.amount++;
          }
        });
      },
      decrease: (id: string) => {
        set((state) => {
          const Item = state.cartItems.find((item) => item.id === id);
          if (Item && Item.amount > 0) {
            Item.amount--;
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
    },
  }))
);

// shawllo 비교를 통해 불필요한 렌더링을 막음
// 필요한 데이터만 구독
export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useCartActions = () => useCartStore((state) => state.actions);
