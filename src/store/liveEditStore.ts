import { create } from "zustand";

interface LiveEditState {
  active: boolean;
  setActive: (active: boolean) => void;
}

/** Tracks whether the visitor is currently inside the admin's live-edit overlay (see LiveEditPage),
 * so PublicLayout can keep in-site navigation (navbar/footer links) inside live-edit mode too. */
export const useLiveEditStore = create<LiveEditState>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));
