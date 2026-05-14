import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'performer' | 'admin';
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isPerformer: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isPerformer: false,
  isCustomer: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch extra profile data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc;
          try {
            userDoc = await getDoc(userDocRef);
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
            return;
          }

          if (userDoc?.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // New user, default to 'user' role
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'user',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest',
              photoURL: firebaseUser.photoURL || '',
            };
            try {
              await setDoc(userDocRef, newProfile);
              setProfile(newProfile);
            } catch (error: any) {
              if (error.message.includes('offline')) {
                // If offline, we can't create the profile yet, but let's at least set a local state
                setProfile(newProfile);
                console.warn("Using temporary local profile while offline");
              } else {
                handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
              }
            }
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          if (error.message.includes('offline')) {
            // Provide a minimal profile if offline
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'user',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest',
              photoURL: firebaseUser.photoURL || '',
            });
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isPerformer: profile?.role === 'performer',
    isCustomer: profile?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
