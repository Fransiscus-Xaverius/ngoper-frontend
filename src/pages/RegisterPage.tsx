import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { login, fetchMe } from '../store/slices/authSlice';
import { authApi } from '../api/auth';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'buyer' | 'jastiper'>('buyer');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: accountType,
      });
      
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        dispatch(fetchMe());
        navigate('/home');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-3xl font-black tracking-tight mb-2">Join the network</h2>
          <p className="text-on-surface/50 mb-8">Create your account to get started</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container/50 outline-none transition-all text-white placeholder:text-white/30"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container/50 outline-none transition-all text-white placeholder:text-white/30"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container/50 outline-none transition-all text-white placeholder:text-white/30 pr-14"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface/40 hover:text-primary transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
                </button>
              </div>
              <p className="text-[10px] text-on-surface/40">
                Must be at least 8 characters with a number and symbol
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="buyer" 
                    className="peer sr-only"
                    checked={accountType === 'buyer'}
                    onChange={() => setAccountType('buyer')}
                  />
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-center peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all">
                    <span className="text-sm font-bold">Buyer</span>
                    <p className="text-[10px] text-on-surface/50 mt-1">Request items</p>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="jastiper" 
                    className="peer sr-only"
                    checked={accountType === 'jastiper'}
                    onChange={() => setAccountType('jastiper')}
                  />
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-center peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all">
                    <span className="text-sm font-bold">Jastiper</span>
                    <p className="text-[10px] text-on-surface/50 mt-1">Deliver items</p>
                  </div>
                </label>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-primary-container focus:ring-primary-container/50 focus:ring-offset-0"
              />
              <span className="text-sm text-on-surface/60">
                I agree to the{' '}
                <a href="#" className="text-primary font-bold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary font-bold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-container text-on-primary-container font-black py-4 rounded-2xl glow-watermelon hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-on-surface/50 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}