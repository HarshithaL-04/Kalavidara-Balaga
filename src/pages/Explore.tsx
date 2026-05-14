import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PerformerProfile } from '../types';
import { Search, MapPin, Filter, Star, Loader2, Music2, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const districts = ['Bangalore', 'Mysore', 'Dharwad', 'Shimoga', 'Mangalore', 'Tumkur', 'Chikmagalur', 'Udupi'];
const artForms = ['Dollu Kunitha', 'Yakshagana', 'Pooja Kunitha', 'Kamsale', 'Veeragase', 'Hulivesha', 'Bhoota Kola', 'Goravara Kunitha'];

const Explore = () => {
  const [performers, setPerformers] = useState<PerformerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('');
  
  useEffect(() => {
    fetchPerformers();
  }, [selectedDistrict, selectedArtForm]);

  const fetchPerformers = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'performerProfiles'), where('isApproved', '==', true));
      
      if (selectedDistrict) {
        q = query(q, where('district', '==', selectedDistrict));
      }
      if (selectedArtForm) {
        q = query(q, where('artForm', '==', selectedArtForm));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data() } as PerformerProfile));
      setPerformers(data);
    } catch (error) {
      console.error("Error fetching performers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformers = performers.filter(p => 
    p.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.artForm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-natural-bg pb-20">
      {/* Header */}
      <div className="bg-natural-secondary border-b border-natural-border pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-natural-text font-serif mb-8 flex items-center gap-3">
             <Filter size={32} className="text-natural-primary" /> Discover Performers
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search by troupe name or art form..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-natural-border focus:ring-1 focus:ring-natural-primary outline-hidden bg-white text-natural-text"
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-6 py-3 rounded-2xl border border-natural-border bg-white text-sm font-bold text-natural-text focus:ring-1 focus:ring-natural-primary min-w-[200px] shadow-sm appearance-none"
              >
                <option value="">All Districts</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select 
                value={selectedArtForm}
                onChange={(e) => setSelectedArtForm(e.target.value)}
                className="px-6 py-3 rounded-2xl border border-natural-border bg-white text-sm font-bold text-natural-text focus:ring-1 focus:ring-natural-primary min-w-[200px] shadow-sm appearance-none"
              >
                <option value="">All Art Forms</option>
                {artForms.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 size={40} className="text-natural-primary animate-spin" />
             <p className="text-natural-muted font-medium uppercase tracking-widest text-[10px] font-bold">Finding best performers for you...</p>
          </div>
        ) : filteredPerformers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredPerformers.map((performer, i) => (
                <motion.div 
                  key={performer.uid}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-natural-border group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={performer.photoUrl || 'https://images.unsplash.com/photo-1608508644127-ae99d652961d?auto=format&fit=crop&q=80&w=400'} 
                      alt={performer.groupName} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 opacity-90"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm text-natural-accent">
                      <Star size={12} className="fill-natural-accent" /> {performer.rating > 0 ? performer.rating.toFixed(1) : 'New'}
                    </div>
                    <div className="absolute bottom-3 left-3">
                       <span className="bg-natural-primary text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-widest">
                         {performer.artForm}
                       </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-natural-text group-hover:text-natural-primary transition-colors mb-1 truncate font-serif">{performer.groupName}</h3>
                    <div className="flex items-center gap-1.5 text-natural-muted text-[10px] font-bold uppercase tracking-wider mb-4">
                      <MapPin size={12} className="text-natural-primary" /> {performer.district} District
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-natural-bg">
                       <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-natural-muted uppercase font-bold tracking-widest">Base Price</span>
                             <span className="text-natural-accent font-bold font-serif">₹{performer.price.toLocaleString()}</span>
                          </div>
                          <Link to={`/performer/${performer.uid}`} className="bg-natural-secondary border border-natural-border text-natural-text px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-natural-primary hover:text-white transition-all shadow-sm">
                             View Details
                          </Link>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-natural-border shadow-sm">
             <div className="w-20 h-20 bg-natural-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 size={32} className="text-natural-muted" />
             </div>
             <h3 className="text-xl font-bold mb-2 font-serif text-natural-text">No Performers Found</h3>
             <p className="text-natural-muted max-w-sm mx-auto font-medium">Try adjusting your filters or search term to find more artists in our network.</p>
             <button 
               onClick={() => { setSelectedDistrict(''); setSelectedArtForm(''); setSearchTerm(''); }}
               className="mt-8 text-natural-primary font-bold hover:underline font-serif"
             >
               Clear All Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
