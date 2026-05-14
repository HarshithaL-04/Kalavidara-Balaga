import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { PerformerProfile, UserProfile } from '../types';
import { 
  ShieldCheck, Users, MapPin, CheckCircle, XCircle, Trash2,
  BarChart3, UserCheck, AlertTriangle, Eye, Loader2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminPanel = () => {
  const [performers, setPerformers] = useState<PerformerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'performerProfiles'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data() } as PerformerProfile));
      setPerformers(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, 'performerProfiles', id), { isApproved: approved });
      setPerformers(prev => prev.map(p => p.uid === id ? { ...p, isApproved: approved } : p));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const removeAccount = async (id: string) => {
    if (!confirm("Are you sure you want to remove this performer? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'performerProfiles', id));
      setPerformers(prev => prev.filter(p => p.uid !== id));
    } catch (error) {
       console.error("Error deleting performer:", error);
    }
  };

  const filtered = performers.filter(p => {
    const matchesFilter = filter === 'all' || (filter === 'pending' ? !p.isApproved : p.isApproved);
    const matchesSearch = p.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-natural-bg pb-20">
      <div className="bg-natural-text text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="text-natural-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-natural-muted">System Administration</span>
              </div>
              <h1 className="text-4xl font-bold font-serif tracking-tight">Management Portal</h1>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex flex-col shadow-sm">
                 <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Total Troupes</span>
                 <span className="text-xl font-bold font-serif">{performers.length}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex flex-col shadow-sm">
                 <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Awaiting Approval</span>
                 <span className="text-xl font-bold text-natural-primary font-serif">{performers.filter(p => !p.isApproved).length}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-natural-border outline-hidden focus:ring-1 focus:ring-natural-primary bg-white text-natural-text font-medium"
              />
           </div>
           <div className="flex bg-white p-1.5 rounded-2xl border border-natural-border shadow-sm">
              {(['all', 'pending', 'approved'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-natural-primary text-white shadow-md' : 'text-natural-muted hover:text-natural-text'}`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-natural-primary" size={40} /></div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-natural-border overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-natural-secondary border-b border-natural-border">
                      <tr>
                         <th className="px-8 py-5 text-[10px] font-bold text-natural-muted uppercase tracking-widest">Performer / Troupe</th>
                         <th className="px-8 py-5 text-[10px] font-bold text-natural-muted uppercase tracking-widest">Art Form</th>
                         <th className="px-8 py-5 text-[10px] font-bold text-natural-muted uppercase tracking-widest">District</th>
                         <th className="px-8 py-5 text-[10px] font-bold text-natural-muted uppercase tracking-widest">Status</th>
                         <th className="px-8 py-5 text-[10px] font-bold text-natural-muted uppercase tracking-widest text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-natural-bg text-sm">
                      {filtered.map(p => (
                        <tr key={p.uid} className="hover:bg-natural-bg/30 transition-colors group">
                           <td className="px-8 py-7">
                              <div className="flex items-center gap-4">
                                 <img src={p.photoUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-natural-border shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                                 <div className="flex flex-col">
                                    <span className="font-bold text-natural-text font-serif text-base">{p.groupName}</span>
                                    <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">Leader: {p.leaderName}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-7 font-bold text-natural-muted uppercase text-[10px] tracking-widest">{p.artForm}</td>
                           <td className="px-8 py-7 text-natural-muted font-medium">
                              <div className="flex items-center gap-1.5 pt-4">
                                 <MapPin size={14} className="text-natural-primary" /> {p.district}
                              </div>
                           </td>
                           <td className="px-8 py-7">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${p.isApproved ? 'bg-natural-secondary border-natural-border text-natural-text' : 'bg-white border-natural-primary text-natural-primary animate-pulse shadow-sm'}`}>
                                 {p.isApproved ? 'Approved' : 'Pending Review'}
                              </span>
                           </td>
                           <td className="px-8 py-7 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 {p.isApproved ? (
                                   <button 
                                     onClick={() => handleStatusUpdate(p.uid, false)}
                                     className="p-2.5 bg-natural-bg rounded-xl text-natural-muted hover:text-natural-accent hover:bg-white border border-transparent hover:border-natural-border transition-all shadow-sm"
                                     title="Unapprove"
                                   >
                                     <AlertTriangle size={18} />
                                   </button>
                                 ) : (
                                   <button 
                                     onClick={() => handleStatusUpdate(p.uid, true)}
                                     className="p-2.5 bg-natural-bg rounded-xl text-natural-muted hover:text-natural-primary hover:bg-white border border-transparent hover:border-natural-border transition-all shadow-sm"
                                     title="Approve"
                                   >
                                     <CheckCircle size={18} />
                                   </button>
                                 )}
                                 <button 
                                   onClick={() => removeAccount(p.uid)}
                                   className="p-2.5 bg-natural-bg rounded-xl text-natural-muted hover:text-red-500 hover:bg-white border border-transparent hover:border-natural-border transition-all shadow-sm"
                                   title="Delete Account"
                                 >
                                   <Trash2 size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                           <td colSpan={5} className="py-24 text-center text-natural-muted font-medium font-serif italic text-lg">No performers found matching criteria.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
