import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  title: string;
  description?: string;

  setHeaderInfo: (title: string, description?: string) => void;
}

export const useNavigationStore = create<State>()(
  persist(
    (set) => ({
      title: "",
      description: undefined,
      setHeaderInfo: (title, description) => set({ title, description }),
    }),
    {
      name: "navigation-storage",
    },
  ),
);
