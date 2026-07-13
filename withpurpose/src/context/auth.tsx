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
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthState>({
  user: undefined,
  profile: null,
  profileLoaded: false,
  isAdmin: false,
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

  // First sign-in (Google or email/password) has no Firestore profile doc
  // yet. Provision it automatically from the auth account's own name/email
  // — no separate "complete your profile" step needed.
  useEffect(() => {
    if (!user || !profileLoaded || profile) return;
    const t = setTimeout(async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: user.displayName || user.email?.split("@")[0] || "Member",
          }),
        });
        if (!res.ok) {
          // fetch() only rejects on a network failure, never on a 4xx/5xx
          // response, so a server-side crash here (e.g. a missing/invalid
          // FIREBASE_SERVICE_ACCOUNT) would otherwise fail completely
          // silently. Log it loudly so it shows up in devtools.
          const body = await res.text();
          console.error(`Profile provisioning failed (${res.status}):`, body);
        }
      } catch (err) {
        console.error("Profile provisioning request failed:", err);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [user, profileLoaded, profile]);

  const value: AuthState = {
    user,
    profile,
    profileLoaded,
    isAdmin: profile?.role === "admin",
    logout: () => signOut(auth),
    getToken: async () => (auth.currentUser ? auth.currentUser.getIdToken() : null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
