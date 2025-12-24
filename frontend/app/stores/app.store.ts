import { create } from 'zustand';

interface IApp {
    isAuthenticated: boolean;
}

interface IAppStore extends IApp {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuth: boolean) => void
}

export const useAppStore = create<IAppStore>((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (isAuth: boolean) => set({ isAuthenticated: isAuth }),
}));