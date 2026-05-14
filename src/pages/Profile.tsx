import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Camera, Loader2, Save, UserCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 border border-natural-border shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-natural-text font-serif tracking-tight">Account Settings</h1>
            <p className="text-natural-muted font-medium mt-2">Manage your personal information and preferences</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-natural-secondary border-2 border-dashed border-natural-border flex items-center justify-center overflow-hidden p-1 shadow-inner group-hover:border-natural-primary transition-all">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover rounded-[2.25rem]" />
                  ) : (
                    <User size={48} className="text-natural-muted" />
                  )}
                  <div className="absolute inset-0 bg-natural-text/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px] rounded-[2.25rem]">
                    <Camera size={24} />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mt-4">Profile Identity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Display Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-natural-primary" size={18} />
                  <input 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-natural-bg/30 text-natural-text font-medium" 
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Email Address</label>
                <input 
                  disabled
                  value={profile?.email || ''}
                  className="w-full px-6 py-4 rounded-2xl border border-natural-border bg-natural-secondary text-natural-muted/60 font-medium cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Photo URL</label>
              <input 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-natural-bg/30 text-natural-text font-medium" 
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="bg-natural-bg/40 p-8 rounded-[2rem] border border-natural-border">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-natural-text font-serif">Account Type</h3>
                    <p className="text-[10px] text-natural-muted font-bold uppercase tracking-widest mt-1">Currently exploring as {profile?.role}</p>
                  </div>
                  {profile?.role === 'performer' && (
                    <button 
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center gap-2 bg-white border border-natural-border px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-natural-primary hover:shadow-lg transition-all"
                    >
                      <Briefcase size={14} /> Artist Dashboard
                    </button>
                  )}
                  {profile?.role === 'user' && (
                    <button 
                      type="button"
                      onClick={() => navigate('/signup')}
                      className="flex items-center gap-2 bg-natural-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-105 transition-all"
                    >
                      Become an Artist
                    </button>
                  )}
               </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-natural-primary text-white py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-natural-primary/20 hover:bg-natural-primary/90 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-[11px]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
