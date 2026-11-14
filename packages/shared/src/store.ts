import { create } from 'zustand';
import type { Colony, User } from './types';

type Language = 'en' | 'hi';
type AppState = {
  language: Language;
  toggleLanguage: () => void;
  currentColony: Colony;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};
export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
  currentColony: { id: 'saket', name: 'Saket', city: 'Delhi' },
  currentUser: null,
  setCurrentUser: (currentUser) => set({ currentUser }),
}));
