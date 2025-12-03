import { create } from "zustand";

export const useSeatStore = create((set) => ({
  editingSeat: null,

  setEditingSeat: (state) => set({ editingSeat: state }),
}));
