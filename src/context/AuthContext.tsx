import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInAnonymously,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  xpPoints: number;
  dailyStreak: number;
  lastDailyCompletedDate: string;
  completedChallenges: string[];
  createdAt?: string;
  updatedAt?: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  syncXPAndStreak: (xp: number, streak: number, completedDate?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore or initialize
  const fetchOrInitProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const localXP = parseInt(localStorage.getItem('geomaster_xp') || '0', 10);
      const localStreak = parseInt(localStorage.getItem('geomaster_daily_streak') || '1', 10);
      const localDate = localStorage.getItem('geomaster_daily_completed_date') || '';

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // Merge cloud XP with higher local XP if any
        const highestXP = Math.max(data.xpPoints || 0, localXP);
        const highestStreak = Math.max(data.dailyStreak || 1, localStreak);

        const updatedProfile: UserProfile = {
          ...data,
          xpPoints: highestXP,
          dailyStreak: highestStreak,
          isAnonymous: user.isAnonymous,
        };

        if (highestXP !== data.xpPoints || highestStreak !== data.dailyStreak) {
          await updateDoc(userRef, {
            xpPoints: highestXP,
            dailyStreak: highestStreak,
            updatedAt: new Date().toISOString(),
          });
        }

        setUserProfile(updatedProfile);
        localStorage.setItem('geomaster_xp', highestXP.toString());
        localStorage.setItem('geomaster_daily_streak', highestStreak.toString());
      } else {
        // Initialize new user profile
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || (user.isAnonymous ? 'Guest Explorer' : user.email?.split('@')[0] || 'Geography Novice'),
          photoURL: user.photoURL || null,
          xpPoints: localXP,
          dailyStreak: localStreak,
          lastDailyCompletedDate: localDate,
          completedChallenges: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isAnonymous: user.isAnonymous,
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching or initializing user profile:', err);
      // Fallback local representation
      const localXP = parseInt(localStorage.getItem('geomaster_xp') || '0', 10);
      const localStreak = parseInt(localStorage.getItem('geomaster_daily_streak') || '1', 10);
      setUserProfile({
        id: user.uid,
        email: user.email,
        displayName: user.displayName || (user.isAnonymous ? 'Guest Explorer' : 'Explorer'),
        photoURL: user.photoURL || null,
        xpPoints: localXP,
        dailyStreak: localStreak,
        lastDailyCompletedDate: '',
        completedChallenges: [],
        isAnonymous: user.isAnonymous,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrInitProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user) {
      await fetchOrInitProfile(cred.user);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await fetchOrInitProfile(cred.user);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      await fetchOrInitProfile(cred.user);
    }
  };

  const signInAsGuest = async () => {
    const cred = await signInAnonymously(auth);
    if (cred.user) {
      await fetchOrInitProfile(cred.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const syncXPAndStreak = async (xp: number, streak: number, completedDate?: string) => {
    setUserProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        xpPoints: xp,
        dailyStreak: streak,
        lastDailyCompletedDate: completedDate || prev.lastDailyCompletedDate,
      };
    });

    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const updateData: Record<string, any> = {
          xpPoints: xp,
          dailyStreak: streak,
          updatedAt: new Date().toISOString(),
        };
        if (completedDate) {
          updateData.lastDailyCompletedDate = completedDate;
        }
        await updateDoc(userRef, updateData);
      } catch (err) {
        console.warn('Failed to sync user stats to cloud:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        syncXPAndStreak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
