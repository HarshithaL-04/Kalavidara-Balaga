import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Lock, User, AtSign, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'user' | 'performer' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            role: role,
            displayName: displayName,
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
      }

      if (!isLogin && role === 'performer') {
        navigate('/register-performer');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('AUTH_CONFIG_ERROR: Email/Password sign-in is not enabled in your Firebase project. To fix this: 1. Go to Firebase Console > Authentication > Sign-in method. 2. Enable "Email/Password". 3. Save changes. Or use Google Sign-in below.');
      } else if (err.message.includes('offline')) {
        setError('Firestore appears to be offline or not provisioned. Please ensure you have accepted the Firebase terms and the database is created.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }

      if (userDoc && !userDoc.exists()) {
        try {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            role: 'user', // Default to user for Google Sign-In
            displayName: user.displayName || 'Guest',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-natural-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2rem] shadow-2xl border border-natural-border"
        >
          <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-natural-text font-serif">
               {isLogin ? 'Welcome Back' : 'Create Account'}
             </h2>
             <p className="text-natural-muted mt-2 text-sm font-medium">
               {isLogin ? 'Sign in to access your talent network' : 'Join the community and start showcasing your talent'}
             </p>
          </div>

          <div className="flex bg-natural-bg p-1.5 rounded-2xl mb-8 border border-natural-border shadow-inner">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-natural-primary shadow-sm border border-natural-border' : 'text-natural-muted hover:text-natural-text'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-natural-primary shadow-sm border border-natural-border' : 'text-natural-muted hover:text-natural-text'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold uppercase tracking-wide">
               <AlertCircle size={18} /> {error}
            </div>
          )}

          {resetSent && (
            <div className="mb-6 p-4 bg-natural-secondary border border-natural-border rounded-2xl flex items-center gap-3 text-natural-primary text-xs font-bold uppercase tracking-wide">
               <AlertCircle size={18} /> Password reset link sent to your email.
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 ml-1">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-primary" size={18} />
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe / Troupe Name"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 text-natural-text font-medium placeholder:text-natural-muted/50"
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 ml-1">Account Type</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-natural-border bg-natural-bg/30 focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm font-bold text-natural-text appearance-none"
                  >
                    <option value="user">I want to hire performers (User)</option>
                    <option value="performer">I am a performer (Artist)</option>
                  </select>
                </motion.div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-primary" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 text-natural-text font-medium placeholder:text-natural-muted/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-primary" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 text-natural-text font-medium placeholder:text-natural-muted/50"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-natural-primary hover:text-natural-accent uppercase tracking-widest"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-natural-primary text-white py-4 rounded-2xl font-bold hover:bg-natural-primary/90 transition-all shadow-lg shadow-natural-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-natural-border"></div>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.2em]">
              <span className="bg-white px-4 text-natural-muted">Or continue with</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className={`w-full border py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest text-[10px] ${
              error && error.includes('AUTH_CONFIG_ERROR') 
                ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20 scale-[1.02]' 
                : 'bg-white border-natural-border text-natural-text hover:bg-natural-bg'
            }`}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className={`w-4 h-4 ${error && error.includes('AUTH_CONFIG_ERROR') ? '' : 'grayscale group-hover:grayscale-0'}`} />
            Google Sign In
          </button>

          <p className="mt-8 text-center text-[10px] text-natural-muted font-bold uppercase tracking-widest">
             By continuing, you agree to our <Link to="/terms" className="text-natural-text hover:underline underline-offset-4">Terms</Link> and <Link to="/privacy" className="text-natural-text hover:underline underline-offset-4">Privacy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
