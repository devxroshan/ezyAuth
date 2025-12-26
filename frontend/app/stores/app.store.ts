import { create } from 'zustand';

interface IApp {
    isAuthenticated: boolean;
}

interface IAppStore extends IApp {
    isAuthenticated: boolean;
    isAccountSettings: boolean;
    setIsAuthenticated: (isAuth: boolean) => void;
    setIsAccountSettings: (isAccountSettings: boolean) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
    isAuthenticated: false,
    isAccountSettings: false,
    setIsAuthenticated: (isAuth: boolean) => set({ isAuthenticated: isAuth }),
    setIsAccountSettings: (isAccountSettings: boolean) => set({ isAccountSettings }),
}));