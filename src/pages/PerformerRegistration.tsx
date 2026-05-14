import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, MapPin, Music2, Phone, Briefcase, IndianRupee, FileText, 
  ChevronRight, ChevronLeft, CheckCircle2, Loader2, Image as ImageIcon,
  Video
} from 'lucide-react';

const steps = [
  { id: 'basic', title: 'Basic Info', icon: <Camera size={20} /> },
  { id: 'details', title: 'Performance Details', icon: <Music2 size={20} /> },
  { id: 'media', title: 'Gallery & Media', icon: <ImageIcon size={20} /> },
  { id: 'pricing', title: 'Pricing & Availability', icon: <IndianRupee size={20} /> },
];

const districts = ['Bangalore', 'Mysore', 'Dharwad', 'Shimoga', 'Mangalore', 'Tumkur', 'Chikmagalur', 'Udupi'];
const artForms = ['Dollu Kunitha', 'Yakshagana', 'Pooja Kunitha', 'Kamsale', 'Goravara Kunitha', 'Sugama Sangeetha', 'Bhootha Kola'];

const PerformerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    groupName: '',
    leaderName: '',
    phone: '',
    email: user?.email || '',
    district: '',
    artForm: '',
    experience: '',
    price: '',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1514525253361-b83f820c2b4d?auto=format&fit=crop&q=80&w=400',
    gallery: [],
    videos: [],
    availability: [],
    equipment: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const performerData = {
        ...formData,
        uid: user.uid,
        price: Number(formData.price),
        isApproved: false, // Default to false until admin reviews
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'performerProfiles', user.uid), performerData);
      await updateDoc(doc(db, 'users', user.uid), { role: 'performer' });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving performer profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-natural-text font-serif mb-4 tracking-tight">Complete Your Profile</h1>
        <p className="text-natural-muted font-medium text-lg">Fill in your details to start getting bookings from event managers.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-16 relative">
        <div className="absolute top-7 left-0 w-full h-[1px] bg-natural-border -z-10" />
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-4 bg-natural-bg px-2">
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all border-2 ${index <= currentStep ? 'bg-natural-primary border-natural-primary text-white shadow-xl shadow-natural-primary/20' : 'bg-white border-natural-border text-natural-muted'}`}>
              {index < currentStep ? <CheckCircle2 size={24} /> : step.icon}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${index <= currentStep ? 'text-natural-primary' : 'text-natural-muted'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-natural-border min-h-[450px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              <div className="flex flex-col items-center mb-12">
                 <div className="w-32 h-32 rounded-[2rem] bg-natural-secondary flex items-center justify-center border-2 border-dashed border-natural-border relative group cursor-pointer overflow-hidden p-1 shadow-inner">
                    <img src={formData.photoUrl} className="w-full h-full object-cover rounded-[1.75rem]" alt="Profile preview" />
                    <div className="absolute inset-0 bg-natural-text/40 backdrop-blur-[2px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all rounded-[1.75rem]">
                       <Camera size={32} />
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mt-4">Upload Profile Photo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Group Name</label>
                  <input name="groupName" value={formData.groupName} onChange={handleChange} placeholder="e.g. Sri Rama Kala Sangha" className="w-full px-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 font-medium text-natural-text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Leader Name</label>
                  <input name="leaderName" value={formData.leaderName} onChange={handleChange} placeholder="e.g. Kumar S." className="w-full px-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 font-medium text-natural-text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" className="w-full px-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 font-medium text-natural-text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} disabled className="w-full px-6 py-4 rounded-2xl border border-natural-border bg-natural-secondary text-natural-muted/60 text-sm font-medium" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">District</label>
                  <select name="district" value={formData.district} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-natural-border bg-natural-bg/30 focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm font-medium text-natural-text">
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Art Form</label>
                  <select name="artForm" value={formData.artForm} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-natural-border bg-natural-bg/30 focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm font-medium text-natural-text">
                    <option value="">Select Art Form</option>
                    {artForms.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Years of Experience</label>
                <input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 15 Years" className="w-full px-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 font-medium text-natural-text" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Troupe Narrative</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={6} 
                  placeholder="Tell us about your history, performances, and style..." 
                  className="w-full px-6 py-5 rounded-[2rem] border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 resize-none font-medium text-natural-text leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
               key="step2"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-8"
            >
              <div className="p-16 border-2 border-dashed border-natural-border rounded-[2.5rem] text-center bg-natural-bg/30 flex flex-col items-center hover:border-natural-primary transition-all group">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} className="text-natural-primary" />
                 </div>
                 <h3 className="text-xl font-bold font-serif text-natural-text">Gallery Photos</h3>
                 <p className="text-sm text-natural-muted font-medium mb-8">Upload photos of your best performances (max 10)</p>
                 <button className="bg-white border border-natural-border px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-natural-text shadow-sm hover:shadow-xl transition-all hov">Select Photos</button>
              </div>

              <div className="p-16 border-2 border-dashed border-natural-border rounded-[2.5rem] text-center bg-natural-bg/30 flex flex-col items-center hover:border-natural-primary transition-all group">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Video size={32} className="text-natural-primary" />
                 </div>
                 <h3 className="text-xl font-bold font-serif text-natural-text">Video Links</h3>
                 <p className="text-sm text-natural-muted font-medium mb-8">Add YouTube or Vimeo links to your videos</p>
                 <button className="bg-white border border-natural-border px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-natural-text shadow-sm hover:shadow-xl transition-all">Add Links</button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div 
               key="step3"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-12"
            >
              <div>
                <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3 ml-2">Base Booking Price (₹)</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-natural-accent font-bold">₹</div>
                   <input 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleChange} 
                    placeholder="15000" 
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden transition-all text-sm bg-natural-bg/30 font-bold text-natural-accent" 
                   />
                </div>
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-4 ml-2">Select Availability Patterns</label>
                 <div className="flex flex-wrap gap-4">
                    {['Summer Season', 'Festivals (Aug-Oct)', 'Wedding Season', 'Year Round'].map((tag, i) => (
                      <button 
                        key={tag} 
                        className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${i === 0 || i === 3 ? 'bg-natural-primary border-natural-primary text-white shadow-lg shadow-natural-primary/20' : 'bg-white border-natural-border text-natural-muted hover:border-natural-primary'}`}
                      >
                        {tag}
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-between items-center border-t border-natural-bg pt-10">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'text-natural-muted hover:text-natural-text active:scale-95'}`}
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          {currentStep === steps.length - 1 ? (
             <button 
               onClick={handleSubmit} 
               disabled={loading}
               className="bg-natural-primary text-white px-12 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-natural-primary/20 min-w-[200px] justify-center transition-all"
             >
               {loading ? <Loader2 size={18} className="animate-spin" /> : 'Finish Registration'}
             </button>
          ) : (
            <button 
              onClick={nextStep} 
              className="bg-natural-text text-white px-12 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-natural-primary flex items-center gap-3 shadow-2xl shadow-natural-text/20 transition-all hover:scale-105 active:scale-95"
            >
              Next Step <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformerRegistration;
