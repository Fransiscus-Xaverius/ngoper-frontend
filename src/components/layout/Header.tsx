import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';

const navLinks = [
  { label: 'Home', href: '/home' },
  { label: 'Explore', href: '/explore' },
  { label: 'Chat', href:'/chat'},
  { label: 'Transactions', href: '/' },
];

interface HeaderProps {
  variant?: 'default' | 'loggedIn';
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export function Header({ variant = 'default', backButton }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = variant === 'loggedIn';

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-6 lg:px-8 h-20 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          {backButton && backButton.show === true ? (
            <button
              onClick={backButton.onClick}
              className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95"
            >
              <MaterialIcon name="arrow_back" className="text-primary" />
            </button>
          ) : isLoggedIn ? (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <MaterialIcon name="menu" className="text-primary" />
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
            >
              <MaterialIcon name="menu" className="text-primary" />
            </button>
          )}
          {!backButton?.show && (
            <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tighter text-primary-container">
                Ngoper
              </h1>
            </Link>
          )}
        </div>

        {isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-on-surface/60 hover:text-primary transition-colors text-sm font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-on-surface/60 hover:text-primary transition-colors text-sm uppercase tracking-[0.15em] font-bold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <MaterialIcon name="search" className="text-on-surface/60" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <MaterialIcon name="notifications" className="text-on-surface/60" />
              </button>
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-primary-container overflow-hidden border-2 border-white/10 hover:scale-105 transition-transform"
              >
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt3fx0PVaY_8kfeKhYjpCMLeqt1aroQOVO1FmLnlNyV5Oq2lDI9_ZkLZK5_AP13-0U1chFHPwDV-D1uWLjBrstrwWl_vnImKzwfaAQUUk2GTHqPPdS5rZGWkoqqL4ZjFQcYiYnXd83jng8-IVeeWhuiR5Z4fhjSQUESY1ZSUmebNoNOEl9bzOXwCgei-VEii8FBuGDOK8klTiPpiCwjnbKq5jN8JZu1pCoZuN2cNd7XxqyFvAkbzDLMMhGspD6KIJwRzHrjl-dl7A"
                />
              </Link>
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 bg-white text-black font-extrabold rounded-full text-sm hover:scale-105 active:scale-95 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-primary-container text-on-primary-container font-extrabold rounded-full text-sm glow-watermelon hover:scale-105 active:scale-95 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 w-80 h-full bg-surface border-r border-white/10 transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tighter text-primary-container">
                Ngoper
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <MaterialIcon name="close" className="text-on-surface" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-on-surface/60 hover:text-primary hover:bg-white/5 transition-colors text-lg font-bold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {isLoggedIn ? (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-on-surface/60 hover:text-primary hover:bg-white/5 transition-colors text-lg font-bold"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-on-surface/60 hover:text-primary hover:bg-white/5 transition-colors text-lg font-bold"
                >
                  Settings
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-lg font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-white text-black font-extrabold rounded-full text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-primary-container text-on-primary-container font-extrabold rounded-full text-sm glow-watermelon"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}