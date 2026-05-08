import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-primary-container">
              Ngoper
            </h1>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 lg:p-12">
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome back</h2>
          <p className="text-on-surface/50 mb-8">Sign in to continue your journey</p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container/50 outline-none transition-all text-white placeholder:text-white/30"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container/50 outline-none transition-all text-white placeholder:text-white/30 pr-14"
                  placeholder="Enter your password"
                />
<button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface/40 hover:text-primary transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-container focus:ring-primary-container/50 focus:ring-offset-0"
                />
                <span className="text-sm text-on-surface/60">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary font-bold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container font-black py-4 rounded-2xl glow-watermelon hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-on-surface/50 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-on-surface/30 text-xs mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}