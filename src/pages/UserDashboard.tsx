import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Booking, Review } from '../types';
import { 
  Calendar, CheckCircle2, Clock, XCircle, Star, 
  MapPin, IndianRupee, MessageSquare, Camera, Loader2,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal || !user) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        bookingId: showReviewModal.id,
        performerId: showReviewModal.performerId,
        userId: user.uid,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString()
      });
      
      // Update booking to mark as reviewed (optional field)
      await updateDoc(doc(db, 'bookings', showReviewModal.id), { reviewed: true });
      setShowReviewModal(null);
      setReviewData({ rating: 5, comment: '' });
      alert("Review submitted! Thank you for your feedback.");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-natural-secondary text-natural-primary border-natural-border';
      case 'accepted': return 'bg-natural-secondary text-natural-accent border-natural-border';
      case 'completed': return 'bg-natural-primary text-white border-natural-primary';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-natural-bg text-natural-muted border-natural-border';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-natural-bg"><Loader2 className="animate-spin text-natural-primary" size={40} /></div>;

  return (
    <div className="min-h-screen bg-natural-bg py-12 px-4 shadow-inner">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-natural-text font-serif">My Bookings</h1>
            <p className="text-natural-muted mt-2 font-medium">Manage and track your performance requests</p>
          </div>
          <div className="bg-white px-8 py-5 rounded-[2rem] border border-natural-border flex items-center gap-10 shadow-xl">
             <div className="flex flex-col">
                <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">Total Bookings</span>
                <span className="text-2xl font-bold font-serif text-natural-text">{bookings.length}</span>
             </div>
             <div className="w-px h-10 bg-natural-bg" />
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/profile')}
                  className="bg-natural-bg text-natural-muted p-3 mb-1 rounded-2xl hover:bg-natural-secondary hover:text-natural-primary transition-all border border-transparent hover:border-natural-border group"
                  title="Profile Settings"
                >
                  <UserCircle size={24} className="group-hover:scale-110 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {bookings.map((booking, i) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-natural-border shadow-md hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex gap-8">
                   <div className="w-24 h-24 bg-natural-secondary rounded-[1.5rem] flex flex-col items-center justify-center border border-natural-border shrink-0 shadow-inner">
                      <span className="text-[10px] font-bold uppercase text-natural-muted tracking-widest">{new Date(booking.eventDate).toLocaleDateString('en-IN', { month: 'short' })}</span>
                      <span className="text-4xl font-bold text-natural-text font-serif leading-none mt-1">{new Date(booking.eventDate).getDate()}</span>
                   </div>
                   <div className="pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-natural-text font-serif">{(booking as any).performerName || 'Performance Group'}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-natural-muted">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-natural-primary" /> {booking.location}</div>
                        <div className="flex items-center gap-1.5"><IndianRupee size={14} className="text-natural-accent" /> ₹{booking.priceAtBooking?.toLocaleString()}</div>
                      </div>
                      <p className="mt-5 text-sm text-natural-muted/80 font-medium italic border-l-2 border-natural-primary/20 pl-4">"{booking.details}"</p>
                   </div>
                </div>

                <div className="flex flex-col md:items-end gap-4">
                   {booking.status === 'completed' && !(booking as any).reviewed && (
                     <button 
                       onClick={() => setShowReviewModal(booking)}
                       className="bg-natural-primary text-white ml-auto px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:bg-natural-primary/90 transition-all flex items-center gap-2"
                     >
                       <Star size={16} /> Write Review
                     </button>
                   )}
                   {booking.status === 'pending' && <p className="text-[10px] font-bold text-natural-primary uppercase tracking-widest animate-pulse ml-auto bg-natural-secondary p-1 rounded">Waiting for artist approval</p>}
                   <span className="text-[10px] text-natural-muted font-bold uppercase tracking-[0.2em] opacity-40 ml-auto">ID: #{booking.id.slice(0,8)}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {bookings.length === 0 && (
            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-natural-border shadow-xl">
               <div className="w-20 h-20 bg-natural-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Calendar size={32} className="text-natural-muted" />
               </div>
               <h3 className="text-2xl font-bold mb-3 font-serif text-natural-text">No bookings yet</h3>
               <p className="text-natural-muted max-w-sm mx-auto font-medium">Start exploring and find the perfect troupe for your next event.</p>
               <button onClick={() => navigate('/explore')} className="mt-10 bg-natural-primary text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-natural-primary/20 hover:scale-105 transition-all">Find Artists Now</button>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-natural-text/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-natural-border"
            >
               <h3 className="text-3xl font-bold mb-3 font-serif text-natural-text">Share Your Experience</h3>
               <p className="text-natural-muted text-sm mb-10 font-medium">How was the performance of {(showReviewModal as any).performerName}?</p>
               
               <form onSubmit={handleReviewSubmit} className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className="p-1 transition-transform active:scale-90"
                      >
                        <Star size={36} className={`${reviewData.rating >= star ? 'text-natural-accent fill-natural-accent' : 'text-natural-bg fill-natural-bg'} transition-all`} />
                      </button>
                    ))}
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Your Review</label>
                     <textarea 
                       required
                       rows={4}
                       value={reviewData.comment}
                       onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                       className="w-full px-6 py-4 rounded-2xl border border-natural-border outline-hidden focus:ring-1 focus:ring-natural-primary text-sm bg-natural-bg/30 text-natural-text placeholder:text-natural-muted/50 resize-none font-medium"
                       placeholder="Tell others what you liked about the troupe..."
                     />
                  </div>

                  <div className="flex gap-4">
                     <button type="button" onClick={() => setShowReviewModal(null)} className="flex-1 px-6 py-4 rounded-2xl border border-natural-border text-[10px] font-bold text-natural-muted uppercase tracking-widest bg-natural-secondary hover:bg-natural-bg transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 px-6 py-4 rounded-2xl bg-natural-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-natural-primary/20 hover:scale-105 transition-all">Submit Review</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
