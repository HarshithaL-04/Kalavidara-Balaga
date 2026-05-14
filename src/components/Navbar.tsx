import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { Menu, X, User, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const { user, profile, isAdmin, isPerformer } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-natural-secondary border-b border-natural-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 bg-natural-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rotate-45"></div>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-natural-text">
                Kalavidara Balaga
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/explore" className="text-natural-muted border-transparent hover:text-natural-primary hover:border-natural-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Explore
              </Link>
              {isPerformer && (
                <Link to="/dashboard" className="text-natural-muted border-transparent hover:text-natural-primary hover:border-natural-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Performer Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-natural-muted border-transparent hover:text-natural-primary hover:border-natural-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            {user ? (
              <>
                <NotificationsDropdown />
                <div className="relative ml-3" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-natural-border/20 transition-all cursor-pointer focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-natural-primary/10 flex items-center justify-center text-natural-primary font-bold border border-natural-primary/20">
                      {profile?.displayName?.[0] || 'U'}
                    </div>
                    <div className="flex flex-col items-start pr-2">
                      <span className="text-xs font-semibold text-natural-text max-w-[100px] truncate">{profile?.displayName}</span>
                      <span className="text-[9px] text-natural-muted uppercase font-bold tracking-widest">{profile?.role}</span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full pt-2 w-48 z-50"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl py-3 border border-natural-border overflow-hidden ring-1 ring-black/5">
                          <Link 
                            to="/profile" 
                            onClick={() => setProfileMenuOpen(false)}
                            className="block px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-natural-text hover:bg-natural-bg hover:text-natural-primary transition-colors"
                          >
                            Profile Settings
                          </Link>
                          {isPerformer && (
                            <Link 
                              to="/dashboard" 
                              onClick={() => setProfileMenuOpen(false)}
                              className="block px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-natural-text hover:bg-natural-bg hover:text-natural-primary transition-colors"
                            >
                              Artist Dashboard
                            </Link>
                          )}
                          <div className="my-2 border-t border-natural-bg mx-4" />
                          <button 
                            onClick={handleLogout} 
                            className="w-full text-left px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <LogOut size={14} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-natural-text hover:text-natural-primary px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-natural-primary text-white hover:bg-natural-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
                  Join as Artist
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-natural-muted hover:bg-natural-secondary rounded-md">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden border-t border-natural-border bg-natural-secondary"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/explore" className="block px-3 py-2 text-base font-medium text-natural-text hover:bg-natural-border/20">Explore</Link>
              {user && <Link to="/profile" className="block px-3 py-2 text-base font-medium text-natural-text hover:bg-natural-border/20">Profile Settings</Link>}
              {isPerformer && <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-natural-text hover:bg-natural-border/20">Dashboard</Link>}
              {isAdmin && <Link to="/admin" className="block px-3 py-2 text-base font-medium text-natural-text hover:bg-natural-border/20">Admin</Link>}
              {!user ? (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-natural-text hover:bg-natural-border/20">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 text-base font-bold text-natural-primary">Join as Artist</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600">Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
