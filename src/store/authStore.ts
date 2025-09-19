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

export const useAuthStore = create<AuthState>((set, get) => ({
  // 初始状态 - 演示用默认用户
  user: {
    id: 'demo_user_001',
    userId: 'demo_user_001',
    username: 'demo_user',
    email: 'demo@example.com',
    publicKey: '0x1234567890abcdef1234567890abcdef12345678',
    biometricStatus: 'bound',
    status: 'active',
    createdAt: new Date().toISOString(),
    authCount: 1
  },
  isAuthenticated: true,
  authSession: {
    id: 'demo_session_001',
    userId: 'demo_user_001',
    agentId: 'demo_agent_001',
    biometricVerified: true,
    contractVerified: true,
    zkProof: null,
    status: 'success',
    timestamp: new Date().toISOString()
  },
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