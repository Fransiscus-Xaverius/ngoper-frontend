import { Link } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';

const navLinks = [
  { label: 'Explore', href: '/' },
  { label: 'Jastipers', href: '/' },
  { label: 'Pricing', href: '/' },
];

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4 lg:gap-6">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors -ml-2 lg:hidden">
          <MaterialIcon name="menu" className="text-primary" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tighter text-primary-container">
            Ngoper
          </h1>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="text-on-surface/60 hover:text-primary transition-colors text-sm uppercase tracking-[0.15em] font-bold"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
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
    </header>
  );
}