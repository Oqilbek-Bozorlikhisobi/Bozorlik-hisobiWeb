import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User tipi
// interface User {
//   id: string;
//   name: string;
// }

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  setUser: (accessToken: string, refreshToken: string, user: any) => void;
  setUserChange: (user: any) => void;
  updateTokens: (newAccessToken: string, newRefreshToken: string) => void;
  clearUser: () => void;
}

export const useStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setUserChange: (user: any) =>
       set({ user}),

      setUser: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),

      updateTokens: (newAccessToken, newRefreshToken) =>
        set({ accessToken: newAccessToken, refreshToken: newRefreshToken }),

      clearUser: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "user-store-market-client",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
