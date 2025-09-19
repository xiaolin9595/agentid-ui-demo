import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import AgentsListPage from './pages/agents/AgentsListPage';
import CreateAgentPage from './pages/agents/CreateAgentPage';
import AgentDetailPage from './pages/agents/AgentDetailPage';
import BlockchainPage from './pages/blockchain/BlockchainPage';
import ProfilePage from './pages/profile/ProfilePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ImageTest from './components/ImageTest';
import SimpleTestPage from './pages/SimpleTestPage';
import { CredentialUploadDemo } from './pages/demo/CredentialUploadDemo';
import { useAuthStore } from './store/authStore';
import './styles/index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 认证页面 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 主要应用布局 */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="agents" element={<AgentsListPage />} />
            <Route path="agents/create" element={<CreateAgentPage />} />
            <Route path="agents/:id" element={<AgentDetailPage />} />
            <Route path="blockchain" element={<BlockchainPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="image-test" element={<ImageTest />} />
          </Route>

          {/* 公开访问路由 */}
          <Route path="/public-image-test" element={<ImageTest />} />
          <Route path="/public-credential-upload" element={<CredentialUploadDemo />} />
          <Route path="/simple-test" element={<SimpleTestPage />} />

          {/* 404页面 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
