import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PerformerProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createNotification } from '../lib/notifications';
import { 
  Star, MapPin, Calendar, Clock, Image as ImageIcon, Video, 
  Phone, Share2, Heart, ShieldCheck, ArrowLeft, Loader2, Sparkles,
  ChevronRight, CalendarCheck, UserCircle, Briefcase, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PerformerProfilePage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [performer, setPerformer] = useState<PerformerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ eventDate: '', location: '', details: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchPerformer = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'performerProfiles', id));
        if (docSnap.exists()) {
          setPerformer(docSnap.data() as PerformerProfile);
        }
      } catch (err) {
        console.error("Error fetching performer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformer();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !performer) {
      navigate('/login');
      return;
    }
    
    setBookingLoading(true);
    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        performerId: performer.uid,
        performerName: performer.groupName,
        userId: user.uid,
        userName: profile?.displayName || user.email,
        eventDate: bookingData.eventDate,
        location: bookingData.location,
        details: bookingData.details,
        status: 'pending',
        priceAtBooking: performer.price,
        createdAt: new Date().toISOString()
      });

      // Notify the performer
      await createNotification(
        performer.uid,
        'booking_request',
        `New booking request from ${profile?.displayName || user.email} for ${bookingData.eventDate}`,
        bookingRef.id
      );

      alert("Booking request sent successfully! You will be notified once the performer accepts.");
      setShowBooking(false);
    } catch (err) {
      console.error("Error creating booking:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-natural-bg"><Loader2 className="animate-spin text-natural-primary" size={40} /></div>;
  if (!performer) return <div className="p-20 text-center bg-natural-bg text-natural-muted font-serif text-xl">Performer not found.</div>;

  return (
    <div className="min-h-screen bg-natural-bg pb-20">
      {/* Dynamic Header */}
      <div className="relative h-[300px] md:h-[450px]">
         <img src={performer.photoUrl} className="w-full h-full object-cover" alt={performer.groupName} />
         <div className="absolute inset-0 bg-linear-to-t from-natural-text via-natural-text/40 to-transparent" />
         
         <div className="absolute top-6 left-4 md:left-8">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
               <ArrowLeft size={20} />
            </button>
         </div>

         <div className="absolute bottom-10 left-4 md:left-8 right-4 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
               <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-natural-primary rounded-lg text-[10px] font-bold uppercase tracking-widest">{performer.artForm}</span>
                  {performer.isApproved && <span className="flex items-center gap-1 text-[10px] bg-natural-accent/50 backdrop-blur-md px-2 py-1 rounded-lg font-bold uppercase tracking-widest"><ShieldCheck size={12} /> Verified</span>}
               </div>
               <h1 className="text-4xl md:text-6xl font-bold font-serif mb-2">{performer.groupName}</h1>
               <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1.5 font-medium"><MapPin size={16} className="text-natural-primary" /> {performer.district}</div>
                  <div className="flex items-center gap-1.5 font-medium"><Star size={16} className="text-natural-accent fill-natural-accent" /> {performer.rating.toFixed(1)} ({performer.reviewCount} Reviews)</div>
               </div>
            </div>
            
            <div className="flex gap-4">
               <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 border border-white/20 shadow-sm"><Heart size={20} /></button>
               <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 border border-white/20 shadow-sm"><Share2 size={20} /></button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12 text-natural-text">
           <section>
              <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3">
                 <Sparkles className="text-natural-primary" /> About the Troupe
              </h2>
              <p className="text-natural-muted leading-relaxed text-lg whitespace-pre-wrap font-medium">
                 {performer.description}
              </p>
           </section>

           <section>
              <h2 className="text-xl font-bold font-serif mb-6">Traditional Gear & Equipment</h2>
              <div className="flex flex-wrap gap-3">
                 {performer.equipment.length > 0 ? performer.equipment.map(eq => (
                   <span key={eq} className="px-4 py-2 bg-white border border-natural-border rounded-xl text-[10px] font-bold text-natural-muted shadow-xs uppercase tracking-widest">
                      {eq}
                   </span>
                 )) : <span className="text-natural-muted font-medium italic">Self-sufficient troupe with traditional instruments.</span>}
              </div>
           </section>

           <section>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold font-serif">Portfolio Gallery</h2>
                 <button className="text-natural-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 underline underline-offset-4">View All <ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833",
                    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
                    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
                    "https://images.unsplash.com/photo-1608508644127-ae99d652961d",
                    "https://images.unsplash.com/photo-1596742572447-9150097764d8",
                    "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9"
                  ].map((url, i) => (
                    <div key={i} className="aspect-square rounded-3xl bg-natural-secondary overflow-hidden cursor-zoom-in group border border-natural-border shadow-sm">
                       <img src={`${url}?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover transition-transform group-hover:scale-110 opacity-90" alt="Gallery" />
                    </div>
                  ))}
              </div>
           </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
           <div className="bg-white p-8 rounded-3xl border border-natural-border shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">Starting Price</span>
                    <div className="text-3xl font-bold text-natural-text font-serif">₹{performer.price.toLocaleString()}</div>
                 </div>
                 <div className="bg-natural-secondary border border-natural-border text-natural-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Available</div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 text-sm text-natural-muted bg-natural-bg/50 p-4 rounded-2xl border border-natural-border/50">
                    <UserCircle className="text-natural-primary shrink-0" size={18} />
                    <span className="font-medium font-serif">Group Leader: <strong className="text-natural-text">{performer.leaderName}</strong></span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-natural-muted bg-natural-bg/50 p-4 rounded-2xl border border-natural-border/50">
                    <Briefcase className="text-natural-primary shrink-0" size={18} />
                    <span className="font-medium font-serif">Experience: <strong className="text-natural-text">{performer.experience}</strong></span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-natural-muted bg-natural-bg/50 p-4 rounded-2xl border border-natural-border/50">
                    <CalendarCheck className="text-natural-primary shrink-0" size={18} />
                    <span className="font-medium font-serif">Response Time: <strong className="text-natural-text">Under 2 hours</strong></span>
                 </div>
              </div>

              {!showBooking ? (
                <button 
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-natural-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-natural-primary/20 hover:bg-natural-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                  Request Booking <ArrowRight size={20} />
                </button>
              ) : (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleBooking}
                  className="space-y-4 border-t border-natural-border pt-6"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2">Event Date</label>
                    <input 
                      type="date" 
                      required 
                      value={bookingData.eventDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-natural-border text-sm bg-natural-bg/30 text-natural-text" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2">Location</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Hebbal, Bangalore"
                      value={bookingData.location}
                      onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-natural-border text-sm bg-natural-bg/30 text-natural-text placeholder:text-natural-muted/50" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2">Message to Troupe</label>
                    <textarea 
                      required
                      placeholder="Type of event, details..."
                      value={bookingData.details}
                      onChange={(e) => setBookingData(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-natural-border text-sm resize-none bg-natural-bg/30 text-natural-text placeholder:text-natural-muted/50"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowBooking(false)} className="flex-1 bg-natural-secondary text-natural-muted font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] border border-natural-border">Cancel</button>
                    <button type="submit" disabled={bookingLoading} className="flex-2 bg-natural-primary text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center uppercase tracking-widest text-[10px] shadow-natural-primary/20">
                       {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Request'}
                    </button>
                  </div>
                </motion.form>
              )}
              
              <div className="mt-8 pt-8 border-t border-natural-border flex items-center justify-center gap-6">
                 <div className="flex flex-col items-center">
                    <div className="p-3 bg-natural-bg rounded-full text-natural-muted shadow-xs"><ImageIcon size={20} /></div>
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-natural-muted">Photos</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="p-3 bg-natural-bg rounded-full text-natural-muted shadow-xs"><Video size={20} /></div>
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-natural-muted">Videos</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="p-3 bg-white border border-natural-primary rounded-full text-natural-primary shadow-lg shadow-natural-primary/10"><Phone size={20} /></div>
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-natural-primary">Contact</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PerformerProfilePage;
