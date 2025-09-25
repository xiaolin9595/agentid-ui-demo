import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GeneratedIdentity,
  IdentityGenerationConfig,
  GenerationProcess,
  GenerationStep,
  GenerationHistoryItem,
  GenerationStats
} from '@/types/identity';

interface IdentityState {
  // 配置状态
  config: IdentityGenerationConfig;

  // 当前生成过程
  currentProcess: GenerationProcess | null;

  // 生成的身份标识列表
  identities: GeneratedIdentity[];

  // 历史记录
  history: GenerationHistoryItem[];

  // 统计数据
  stats: GenerationStats | null;

  // UI状态
  isLoading: boolean;
  error: string | null;

  // 动作
  setConfig: (config: Partial<IdentityGenerationConfig>) => void;
  resetConfig: () => void;

  startGeneration: (file: File) => Promise<void>;
  updateProcess: (process: GenerationProcess) => void;
  completeGeneration: (identity: GeneratedIdentity) => void;
  failGeneration: (error: string) => void;
  resetProcess: () => void;

  addIdentity: (identity: GeneratedIdentity) => void;
  removeIdentity: (identityId: string) => void;
  clearIdentities: () => void;

  addToHistory: (item: GenerationHistoryItem) => void;
  clearHistory: () => void;

  updateStats: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 选择器
  getConfig: () => IdentityGenerationConfig;
  getCurrentProcess: () => GenerationProcess | null;
  getIdentities: () => GeneratedIdentity[];
  getHistory: () => GenerationHistoryItem[];
  getStats: () => GenerationStats | null;
  getIsLoading: () => boolean;
  getError: () => string | null;
}

const defaultConfig: IdentityGenerationConfig = {
  prefix: 'AGT',
  useUUID: true,
  includeHash: true,
  hashAlgorithm: 'sha256',
  confidenceThreshold: 0.7,
  enableSteps: true,
  generateMultiple: false,
  count: 1
};

const initialStats: GenerationStats = {
  totalGenerated: 0,
  averageConfidence: 0,
  successRate: 0,
  averageProcessingTime: 0,
  credentialTypeStats: {},
  dailyStats: []
};

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set, get) => ({
      // 初始状态
      config: defaultConfig,
      currentProcess: null,
      identities: [
        // 默认身份标识数据
        {
          id: '1',
          identityId: '1-175826628',
          prefix: '1',
          hash: 'mock-hash-001',
          confidence: 0.95,
          credentialData: {
            id: 'cred-001',
            type: 'id_card',
            name: '张三',
            documentNumber: 'ID123456789',
            issuingCountry: 'CN',
            issuedDate: '2020-01-01',
            expiryDate: '2030-01-01',
            dateOfBirth: '1990-01-01',
            nationality: '中国',
            gender: 'male',
            address: '北京市朝阳区',
            confidence: 0.95,
            extractedAt: '2024-01-15T10:30:00Z'
          },
          generatedAt: '2024-01-15T10:30:00Z',
          steps: [],
          metadata: {
            algorithm: 'AgentID-v1.0',
            version: '1.0.0',
            processingTime: 2000,
            dataQuality: 'high',
            validationStatus: 'passed'
          }
        },
        {
          id: '2',
          identityId: 'lin-175879861',
          prefix: 'lin',
          hash: 'mock-hash-002',
          confidence: 0.92,
          credentialData: {
            id: 'cred-002',
            type: 'id_card',
            name: '张三',
            documentNumber: 'ID987654321',
            issuingCountry: 'CN',
            issuedDate: '2020-02-01',
            expiryDate: '2030-02-01',
            dateOfBirth: '1992-05-15',
            nationality: '中国',
            gender: 'male',
            address: '北京市海淀区',
            confidence: 0.92,
            extractedAt: '2024-02-01T14:20:00Z'
          },
          generatedAt: '2024-02-01T14:20:00Z',
          steps: [],
          metadata: {
            algorithm: 'AgentID-v1.0',
            version: '1.0.0',
            processingTime: 1800,
            dataQuality: 'high',
            validationStatus: 'passed'
          }
        }
      ],
      history: [],
      stats: initialStats,
      isLoading: false,
      error: null,

      // 配置管理
      setConfig: (newConfig) => {
        set((state) => ({
          config: { ...state.config, ...newConfig }
        }));
      },

      resetConfig: () => {
        set({ config: defaultConfig });
      },

      // 生成过程管理
      startGeneration: async (file: File) => {
        const state = get();
        set({
          isLoading: true,
          error: null,
          currentProcess: {
            id: Date.now().toString(),
            credentialFile: file,
            config: state.config,
            status: 'processing',
            progress: 0,
            currentStep: 0,
            steps: [],
            startedAt: new Date().toISOString()
          }
        });

        try {
          // 模拟生成过程
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 这里应该调用实际的生成算法
          // 暂时使用模拟数据
          const mockIdentity: GeneratedIdentity = {
            id: Date.now().toString(),
            identityId: `${state.config.prefix}-${Date.now()}`,
            prefix: state.config.prefix,
            hash: 'mock-hash-' + Math.random().toString(36).substring(2),
            confidence: 0.8 + Math.random() * 0.15,
            credentialData: {
              id: Date.now().toString(),
              type: 'id_card',
              name: '张三',
              documentNumber: 'ID123456789',
              issuingCountry: 'CN',
              issuedDate: '2020-01-01',
              expiryDate: '2030-01-01',
              dateOfBirth: '1990-01-01',
              nationality: '中国',
              gender: 'male',
              address: '北京市朝阳区',
              confidence: 0.9,
              extractedAt: new Date().toISOString()
            },
            generatedAt: new Date().toISOString(),
            steps: [],
            metadata: {
              algorithm: 'AgentID-v1.0',
              version: '1.0.0',
              processingTime: 2000,
              dataQuality: 'high',
              validationStatus: 'passed'
            }
          };

          get().completeGeneration(mockIdentity);
        } catch (error) {
          get().failGeneration(error instanceof Error ? error.message : '生成失败');
        } finally {
          set({ isLoading: false });
        }
      },

      updateProcess: (process) => {
        set({ currentProcess: process });
      },

      completeGeneration: (identity) => {
        set((state) => {
          const newIdentities = [...state.identities, identity];
          const historyItem: GenerationHistoryItem = {
            id: identity.id,
            identityId: identity.identityId,
            credentialName: identity.credentialData.name,
            generatedAt: identity.generatedAt,
            confidence: identity.confidence,
            status: 'success',
            preview: identity
          };

          return {
            currentProcess: {
              ...state.currentProcess!,
              status: 'completed',
              result: identity,
              completedAt: new Date().toISOString()
            },
            identities: newIdentities,
            history: [historyItem, ...state.history]
          };
        });

        get().updateStats();
      },

      failGeneration: (error) => {
        set((state) => ({
          currentProcess: state.currentProcess ? {
            ...state.currentProcess,
            status: 'failed',
            error,
            completedAt: new Date().toISOString()
          } : null,
          error
        }));
      },

      resetProcess: () => {
        set({
          currentProcess: null,
          error: null
        });
      },

      // 身份标识管理
      addIdentity: (identity) => {
        set((state) => {
          const newIdentities = [...state.identities, identity];
          const historyItem: GenerationHistoryItem = {
            id: identity.id,
            identityId: identity.identityId,
            credentialName: identity.credentialData.name,
            generatedAt: identity.generatedAt,
            confidence: identity.confidence,
            status: 'success',
            preview: identity
          };

          return {
            identities: newIdentities,
            history: [historyItem, ...state.history]
          };
        });

        get().updateStats();
      },

      removeIdentity: (identityId) => {
        set((state) => ({
          identities: state.identities.filter(id => id.identityId !== identityId)
        }));

        get().updateStats();
      },

      clearIdentities: () => {
        set({ identities: [] });
        get().updateStats();
      },

      // 历史记录管理
      addToHistory: (item) => {
        set((state) => ({
          history: [item, ...state.history]
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      // 统计数据管理
      updateStats: () => {
        const state = get();
        const identities = state.identities;

        if (identities.length === 0) {
          set({ stats: initialStats });
          return;
        }

        const totalGenerated = identities.length;
        const averageConfidence = identities.reduce((sum, id) => sum + id.confidence, 0) / totalGenerated;
        const successRate = (identities.filter(id => id.confidence >= state.config.confidenceThreshold).length / totalGenerated) * 100;
        const averageProcessingTime = identities.reduce((sum, id) => sum + id.metadata.processingTime, 0) / totalGenerated;

        // 按证件类型统计
        const credentialTypeStats: Record<string, number> = {};
        identities.forEach(identity => {
          const type = identity.credentialData.type;
          credentialTypeStats[type] = (credentialTypeStats[type] || 0) + 1;
        });

        // 按日期统计
        const dailyStats: Array<{ date: string; count: number; success: number; failed: number }> = [];
        const dateGroups: Record<string, { count: number; success: number; failed: number }> = {};

        identities.forEach(identity => {
          const date = new Date(identity.generatedAt).toISOString().split('T')[0];
          if (!dateGroups[date]) {
            dateGroups[date] = { count: 0, success: 0, failed: 0 };
          }
          dateGroups[date].count++;
          if (identity.confidence >= state.config.confidenceThreshold) {
            dateGroups[date].success++;
          } else {
            dateGroups[date].failed++;
          }
        });

        Object.entries(dateGroups).forEach(([date, stats]) => {
          dailyStats.push({ date, ...stats });
        });

        dailyStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        set({
          stats: {
            totalGenerated,
            averageConfidence,
            successRate,
            averageProcessingTime,
            credentialTypeStats,
            dailyStats
          }
        });
      },

      // UI状态管理
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 选择器
      getConfig: () => get().config,
      getCurrentProcess: () => get().currentProcess,
      getIdentities: () => get().identities,
      getHistory: () => get().history,
      getStats: () => get().stats,
      getIsLoading: () => get().isLoading,
      getError: () => get().error
    }),
    {
      name: 'identity-store',
      partialize: (state) => ({
        identities: state.identities,
        history: state.history,
        stats: state.stats,
        config: state.config
      })
    }
  )
);