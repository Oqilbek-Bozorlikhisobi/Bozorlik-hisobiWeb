// store/shoppingStore.ts
import { create } from "zustand";

type ShoppingItem = {
  id: string;
  name: string;
  price: number;
};

type ShoppingState = {
  shoppingList: {
    items: ShoppingItem[];
  };
  setShoppingList: (newItem: ShoppingItem) => void;
};

export const useShoppingStore = create<any>((set) => ({
  shoppingList: {
    items: [],
  },
  showExtraProductDialog: false,
  setShoppingList: (newItem: any) =>
    set((state: any) => ({
      shoppingList: {
        ...state.shoppingList,
        items: [...state.shoppingList.items, newItem],
      },
    })),
  removeShoppingItem: (id: string) =>
    set((state: any) => ({
      shoppingList: {
        ...state.shoppingList,
        items: state.shoppingList.items.filter((item: any) => item.id !== id),
      },
    })),

  setShowExtraProductDialog: (show: any) => set({ showExtraProductDialog: show }),
}));
