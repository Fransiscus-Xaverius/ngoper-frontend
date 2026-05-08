import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { HeroSection, TrendingGrid, TopJastipers } from './components/sections';
import { LoginPage, RegisterPage, ExplorePage, ProfilePage } from './pages';

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;