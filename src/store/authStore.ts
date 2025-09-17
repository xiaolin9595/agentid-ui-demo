import { create } from 'zustand';
import { User, AuthSession } from '../types';

interface AuthState {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;

  // 认证会话
  authSession: AuthSession | null;

  // UI状态
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 初始状态
  user: null,
  isAuthenticated: false,
  authSession: null,
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    error: null
  }),

  setAuthSession: (session) => set({ authSession: session }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    authSession: null,
    error: null
  })
}));