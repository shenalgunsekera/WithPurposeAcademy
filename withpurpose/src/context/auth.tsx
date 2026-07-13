"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserDoc } from "@/lib/site";

type AuthState = {
  /** Firebase auth user (null = signed out, undefined = still loading) */
  user: User | null | undefined;
  /** Firestore profile doc (null = doesn't exist yet) */
  profile: UserDoc | null;
  profileLoaded: boolean;
  isAdmin: boolean;
  /** Signed in but hasn't completed the NIC profile step */
  needsProfile: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthState>({
  user: undefined,
  profile: null,
  profileLoaded: false,
  isAdmin: false,
  needsProfile: false,
  logout: async () => {},
  getToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (!u) {
          setProfile(null);
          setProfileLoaded(true);
        }
      }),
    [],
  );

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserDoc) : null);
      setProfileLoaded(true);
    });
    return unsub;
  }, [user]);

  const value: AuthState = {
    user,
    profile,
    profileLoaded,
    isAdmin: profile?.role === "admin",
    needsProfile: !!user && profileLoaded && (!profile || !profile.nic),
    logout: () => signOut(auth),
    getToken: async () => (auth.currentUser ? auth.currentUser.getIdToken() : null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
