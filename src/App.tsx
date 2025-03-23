import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Home } from './pages/Home';
import { ShortsPage } from './pages/ShortsPage';
import { ChannelPage } from './pages/ChannelPage';
import { ProfilePage } from './pages/ProfilePage';
import { GroupPage } from './pages/GroupPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LivePage from './pages/LivePage';
import { LiveCatalogPage } from './pages/LiveCatalogPage';
import { CreateChannelPage } from './pages/CreateChannelPage';
import { ChannelsCatalog } from './pages/ChannelsCatalog';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { MyChannelPage } from './pages/MyChannelPage';
import { EditChannelPage } from './pages/EditChannelPage';
import SearchResultsPage from './pages/SearchResultsPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/shorts" element={<ProtectedRoute><ShortsPage /></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><LiveCatalogPage /></ProtectedRoute>} />
      <Route path="/live/:id" element={<ProtectedRoute><LivePage /></ProtectedRoute>} />
      <Route path="/channels" element={<ProtectedRoute><ChannelsCatalog /></ProtectedRoute>} />
      <Route path="/channel/create" element={<ProtectedRoute><CreateChannelPage /></ProtectedRoute>} />
      <Route path="/channel/:id" element={<ProtectedRoute><ChannelPage /></ProtectedRoute>} />
      <Route path="/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/group/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
      <Route path="/group/create" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />
      <Route path="/my-channel" element={<ProtectedRoute><MyChannelPage /></ProtectedRoute>} />
      <Route path="/edit-channel" element={<ProtectedRoute><EditChannelPage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />
      <Route path="/user/:username" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
