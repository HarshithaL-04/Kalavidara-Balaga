import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check, X, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  bookingId: string;
  read: boolean;
  createdAt: any;
}

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      markAsRead(n.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-natural-muted hover:text-natural-primary transition-colors relative focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full pt-4 w-80 z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-natural-border overflow-hidden flex flex-col max-h-[450px]">
              <div className="px-6 py-4 border-b border-natural-bg flex justify-between items-center bg-natural-secondary/50">
                <h3 className="font-bold text-sm text-natural-text font-serif">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[9px] font-bold uppercase tracking-widest text-natural-primary hover:underline hover:underline-offset-2"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-natural-bg last:border-0 hover:bg-natural-bg/30 transition-colors flex gap-3 relative group ${!notification.read ? 'bg-natural-primary/5' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        notification.type.includes('request') ? 'bg-blue-100 text-blue-600' :
                        notification.type.includes('accepted') ? 'bg-green-100 text-green-600' :
                        'bg-natural-secondary text-natural-muted'
                      }`}>
                        {notification.type.includes('request') ? <Calendar size={18} /> : <Check size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${!notification.read ? 'font-bold text-natural-text' : 'text-natural-muted font-medium'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[8px] font-bold uppercase tracking-widest text-natural-muted/60">
                          <Clock size={10} />
                          {notification.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="absolute right-4 top-4 w-6 h-6 rounded-full bg-white border border-natural-border shadow-sm flex items-center justify-center text-natural-muted hover:text-natural-primary hover:border-natural-primary transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 px-6 text-center text-natural-muted">
                    <Bell className="mx-auto mb-3 opacity-20" size={32} />
                    <p className="text-xs font-medium font-serif italic">No notifications yet.</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-natural-bg text-center border-t border-natural-border">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-natural-muted">Stay connected to your heritage</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
