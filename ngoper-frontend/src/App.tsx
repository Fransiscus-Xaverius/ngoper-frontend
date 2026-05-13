import { Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { HeroSection, TrendingGrid, TopJastipers } from './components/sections';
import { ExplorePage, ProfilePage, ChatPage, HomePage, LoginPage, RegisterPage } from './pages';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAppSelector } from './store/hooks';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrendingGrid />
        <TopJastipers />
      </main>
      <Footer />
    </div>
  );
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        } 
      />

      {/* Protected routes - require authentication */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home or login based on auth state */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;