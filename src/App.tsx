import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header, Footer } from './components/layout';
import { HeroSection, TrendingGrid, TopJastipers } from './components/sections';
import { ExplorePage, ProfilePage, ChatPage, HomePage, LoginPage, RegisterPage, OrdersPage, MyRequestsPage, TransactionsPage, TripPage, TripDetailPage } from './pages';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { logout } from './store/slices/authSlice';
import { setForceLogoutHandler } from './api/client';

function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setForceLogoutHandler(() => {
      dispatch(logout());
    });
  }, [dispatch]);

  return null;
}

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

function JastiperRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'jastiper') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <AuthSync />
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
      <Route 
        path="/orders" 
        element={
          <JastiperRoute>
            <OrdersPage />
          </JastiperRoute>
        } 
      />
      <Route 
        path="/my-requests" 
        element={
          <ProtectedRoute>
            <MyRequestsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/trips" 
        element={
          <ProtectedRoute>
            <TripPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/:id" 
        element={
          <ProtectedRoute>
            <TripDetailPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home or login based on auth state */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;