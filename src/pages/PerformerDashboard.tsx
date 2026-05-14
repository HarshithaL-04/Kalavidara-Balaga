import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { Booking, PerformerProfile } from '../types';
import { createNotification, NotificationType } from '../lib/notifications';
import { 
  Calendar, CheckCircle, XCircle, Clock, IndianRupee, 
  Settings, Bell, LayoutDashboard, UserCircle, LogOut,
  TrendingUp, Star, Users, MessageSquare, Loader2, Music2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PerformerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingBookings: 0, completedEvents: 0 });
  const [performerProfile, setPerformerProfile] = useState<PerformerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch Performer Profile
    const fetchProfile = async () => {
      const docRef = doc(db, 'performerProfiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPerformerProfile(docSnap.data() as PerformerProfile);
      }
    };
    fetchProfile();

    // Fetch Bookings
    const q = query(collection(db, 'bookings'), where('performerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      
      const earnings = data.filter(b => b.status === 'completed').reduce((acc, curr) => acc + (curr.priceAtBooking || 0), 0);
      const pending = data.filter(b => b.status === 'pending').length;
      const completed = data.filter(b => b.status === 'completed').length;
      
      setStats({ totalEarnings: earnings, pendingBookings: pending, completedEvents: completed });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBookingStatus = async (bookingId: string, newStatus: 'accepted' | 'rejected' | 'completed') => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
      
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        let type: NotificationType = 'booking_accepted';
        let message = `Your booking for ${booking.performerName} has been accepted!`;
        
        if (newStatus === 'rejected') {
          type = 'booking_rejected';
          message = `Your booking for ${booking.performerName} was declined.`;
        } else if (newStatus === 'completed') {
          type = 'booking_completed';
          message = `Your event with ${booking.performerName} is marked as completed!`;
        }

        await createNotification(booking.userId, type, message, bookingId);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-natural-bg"><Loader2 className="animate-spin text-natural-primary" size={40} /></div>;

  return (
    <div className="min-h-screen bg-natural-bg flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-natural-border hidden lg:flex flex-col p-8 sticky top-16 h-[calc(100vh-64px)] shadow-sm">
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-natural-bg">
          <div className="w-12 h-12 rounded-2xl bg-natural-secondary border border-natural-border flex items-center justify-center text-natural-primary font-bold text-xl shadow-inner font-serif">
             {performerProfile?.groupName?.[0] || profile?.displayName?.[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-natural-text text-sm truncate font-serif">{performerProfile?.groupName || profile?.displayName}</span>
            <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">Artist Account</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
            { id: 'bookings', label: 'Manage Bookings', icon: <Calendar size={18} />, count: stats.pendingBookings },
            { id: 'profile', label: 'Troupe Details', icon: <Music2 size={18} /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all border ${activeTab === item.id ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20' : 'text-natural-muted border-transparent hover:bg-natural-bg hover:text-natural-text'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.count ? (
                <span className={`text-[10px] w-5 h-5 rounded-lg flex items-center justify-center ${activeTab === item.id ? 'bg-white text-natural-primary' : 'bg-natural-primary text-white'}`}>{item.count}</span>
              ) : null}
            </button>
          ))}
          <button 
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all border text-natural-muted border-transparent hover:bg-natural-bg hover:text-natural-text"
          >
            <UserCircle size={18} />
            Account Settings
          </button>
        </nav>

        <div className="pt-8 border-t border-natural-bg">
           <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={18} />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-bold text-natural-text font-serif tracking-tight">Artist Overview</h2>
                  <p className="text-natural-muted mt-2 font-medium">Tracking your cultural impact</p>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-2xl border border-natural-border flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-natural-muted shadow-sm">
                   <Calendar size={16} className="text-natural-primary" /> {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-natural-primary p-8 rounded-[2.5rem] shadow-2xl shadow-natural-primary/20 text-white flex flex-col justify-between h-48 border border-white/10 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex justify-between items-start relative z-10">
                       <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md"><IndianRupee size={24} /></div>
                       <TrendingUp size={20} className="text-white/40" />
                    </div>
                    <div className="relative z-10">
                       <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Total Earnings</span>
                       <h3 className="text-4xl font-bold mt-2 font-serif tracking-tight">₹{stats.totalEarnings.toLocaleString()}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] border border-natural-border flex flex-col justify-between h-48 shadow-lg hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start">
                       <div className="bg-natural-secondary border border-natural-border p-3 rounded-2xl text-natural-primary shadow-inner"><Clock size={24} /></div>
                       <Users size={20} className="text-natural-bg" />
                    </div>
                    <div>
                       <span className="text-natural-muted text-[10px] font-bold uppercase tracking-[0.2em]">Pending Orders</span>
                       <h3 className="text-4xl font-bold text-natural-text mt-2 font-serif tracking-tight">{stats.pendingBookings}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] border border-natural-border flex flex-col justify-between h-48 shadow-lg hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start">
                       <div className="bg-natural-secondary border border-natural-border p-3 rounded-2xl text-natural-accent shadow-inner"><Star size={24} /></div>
                       <MessageSquare size={20} className="text-natural-bg" />
                    </div>
                    <div>
                       <span className="text-natural-muted text-[10px] font-bold uppercase tracking-[0.2em]">Live Rating</span>
                       <h3 className="text-4xl font-bold text-natural-text mt-2 font-serif tracking-tight">{performerProfile?.rating || '0.0'}</h3>
                    </div>
                 </div>
              </div>

              {/* Recent Active Bookings */}
              <div className="bg-white rounded-[3rem] border border-natural-border overflow-hidden shadow-xl">
                 <div className="p-8 border-b border-natural-bg flex justify-between items-center bg-natural-secondary/30">
                    <h3 className="font-bold text-xl text-natural-text font-serif">Upcoming Events</h3>
                    <button onClick={() => setActiveTab('bookings')} className="text-natural-primary text-[10px] font-bold uppercase tracking-widest hover:underline underline-offset-4">View All</button>
                 </div>
                 <div className="divide-y divide-natural-bg">
                    {bookings.filter(b => b.status === 'accepted').slice(0, 5).map(booking => (
                      <div key={booking.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-natural-bg/20 transition-colors">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-natural-secondary border border-natural-border rounded-2xl flex flex-col items-center justify-center shadow-inner">
                               <span className="text-[10px] font-bold uppercase text-natural-muted tracking-widest">{new Date(booking.eventDate).toLocaleDateString('en-IN', { month: 'short' })}</span>
                               <span className="text-2xl font-bold text-natural-text font-serif leading-none mt-1">{new Date(booking.eventDate).getDate()}</span>
                            </div>
                            <div>
                               <h4 className="font-bold text-natural-text text-lg font-serif">{booking.location}</h4>
                               <p className="text-sm text-natural-muted font-medium line-clamp-1 border-l border-natural-border pl-3 mt-1 italic">"{booking.details}"</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <div className="text-lg font-bold text-natural-text font-serif whitespace-nowrap">₹{booking.priceAtBooking?.toLocaleString() || '0'}</div>
                               <span className="text-[9px] text-natural-accent font-bold uppercase tracking-[0.2em] bg-natural-secondary px-2 py-0.5 rounded-lg border border-natural-border">Confirmed</span>
                            </div>
                            <button onClick={() => handleBookingStatus(booking.id, 'completed')} className="bg-natural-text text-white px-8 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-natural-primary transition-all shadow-lg active:scale-95">Complete</button>
                         </div>
                      </div>
                    ))}
                    {bookings.filter(b => b.status === 'accepted').length === 0 && (
                      <div className="p-20 text-center text-natural-muted font-medium font-serif italic text-lg bg-white">No confirmed upcoming events. Showcase your talent to get booked!</div>
                    )}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div 
               key="bookings"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
            >
               <h2 className="text-4xl font-bold text-natural-text font-serif tracking-tight">Booking Requests</h2>
               <div className="grid grid-cols-1 gap-6">
                  {bookings.filter(b => b.status === 'pending').map(booking => (
                    <motion.div 
                      layout
                      key={booking.id} 
                      className="bg-white p-8 rounded-[2.5rem] border border-natural-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-natural-primary transition-all group"
                    >
                       <div className="flex items-start gap-8">
                          <div className="w-20 h-20 bg-natural-secondary border border-natural-primary/10 rounded-3xl flex flex-col items-center justify-center text-natural-primary shadow-inner group-hover:scale-105 transition-transform">
                             <span className="text-[11px] font-bold uppercase tracking-widest">{new Date(booking.eventDate).toLocaleDateString('en-IN', { month: 'short' })}</span>
                             <span className="text-3xl font-bold font-serif leading-none mt-1">{new Date(booking.eventDate).getDate()}</span>
                          </div>
                          <div className="pt-1">
                             <h4 className="text-2xl font-bold text-natural-text font-serif leading-tight">{booking.location}</h4>
                             <p className="text-natural-muted font-medium mt-2 mb-4 max-w-xl italic">"{booking.details}"</p>
                             <div className="flex items-center gap-6">
                                <span className="text-[10px] font-bold text-natural-primary uppercase tracking-widest flex items-center gap-2 bg-natural-bg px-3 py-1.5 rounded-xl border border-natural-border shadow-sm">
                                    <IndianRupee size={12} /> {booking.priceAtBooking || performerProfile?.price}
                                </span>
                                <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={12} /> {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleBookingStatus(booking.id, 'rejected')}
                            className="bg-natural-secondary text-natural-muted p-4 rounded-full border border-natural-border hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group/btn"
                            title="Reject"
                          >
                             <XCircle size={22} />
                          </button>
                          <button 
                            onClick={() => handleBookingStatus(booking.id, 'accepted')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-[1.5rem] bg-natural-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-natural-primary/90 shadow-2xl shadow-natural-primary/30 transition-all active:scale-95"
                          >
                             <CheckCircle size={20} /> Accept Booking
                          </button>
                       </div>
                    </motion.div>
                  ))}
                  {bookings.filter(b => b.status === 'pending').length === 0 && (
                    <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-natural-border shadow-md">
                       <Calendar size={64} className="mx-auto text-natural-bg mb-6 animate-pulse" />
                       <h3 className="text-2xl font-bold text-natural-text font-serif">All caught up!</h3>
                       <p className="text-natural-muted font-medium mt-2">No new booking requests at the moment. Keep your profile updated to attract more clients.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
               key="profile"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               className="bg-white p-10 rounded-[3rem] border border-natural-border max-w-3xl shadow-2xl mx-auto"
            >
               <h2 className="text-3xl font-bold text-natural-text font-serif mb-10 tracking-tight">Artist Identity Settings</h2>
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Group Name</label>
                      <input defaultValue={performerProfile?.groupName} className="w-full px-5 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-natural-bg/30 text-natural-text font-bold font-serif" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Base Price (₹)</label>
                      <input defaultValue={performerProfile?.price} type="number" className="w-full px-5 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-natural-bg/30 text-natural-accent font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Troupe Narrative & Legacy</label>
                    <textarea defaultValue={performerProfile?.description} rows={8} className="w-full px-6 py-5 rounded-[2rem] border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-natural-bg/30 text-natural-text resize-none font-medium text-sm leading-relaxed" placeholder="Share your troupe's history and style..." />
                  </div>
                  <button className="bg-natural-text text-white w-full py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-natural-text/20 hover:bg-natural-primary transition-all uppercase tracking-[0.2em] text-[11px] active:scale-[0.98]">Update Profile Presence</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PerformerDashboard;
