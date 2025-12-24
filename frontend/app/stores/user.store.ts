import { create } from 'zustand';

interface IUser {
    name: string;
    email: string;
    profilePic: string;
    isVerified: boolean;
}

interface IUserStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
    user: null,
    setUser: (user: IUser) => set({ user }),
}));