import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent! Check your inbox.');
        setIsForgotPassword(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Get the Firebase ID Token
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('adminToken', token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || (isForgotPassword ? 'Failed to send reset email' : 'Invalid login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-300 via-base-200 to-base-300 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl border border-base-100/10 bg-base-100/60 backdrop-blur-xl p-10 shadow-2xl z-10 relative">
        <div className="mb-10 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6 text-primary-content shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {isForgotPassword ? 'Reset Password' : 'Admin Access'}
          </h1>
          <p className="mt-3 text-sm text-base-content/60">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link' 
              : 'Enter your credentials to manage the portfolio'}
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-base-content/70">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full rounded-lg bg-base-200/50 focus:border-primary"
              placeholder="admin@example.com"
              required
            />
          </div>
          {!isForgotPassword && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-base-content/70">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                    setMessage('');
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full rounded-lg bg-base-200/50 focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          )}
          
          {message && (
            <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
              {message}
            </div>
          )}
          
          <button
            type="submit"
            className="btn border-none bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-content w-full rounded-xl h-12 shadow-md transition-all"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : (isForgotPassword ? 'Send Reset Link' : 'Log In')}
          </button>
          
          {isForgotPassword && (
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setError('');
                setMessage('');
              }}
              className="btn btn-ghost w-full rounded-xl h-12 transition-all mt-2"
              disabled={loading}
            >
              Back to Login
            </button>
          )}
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-base-content/50 hover:text-primary transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
