"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/site";

/** Live list of published courses (public read). */
export function useCourses() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "courses"), where("published", "==", true));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ ...(d.data() as Course), id: d.id }))
          .sort((a, b) => a.priceUsd - b.priceUsd);
        setCourses(list);
      },
      () => setCourses([]),
    );
  }, []);

  return courses;
}

/** Live set of courseIds the signed-in user owns. */
export function usePurchases(uid: string | undefined) {
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!uid) {
      // Defer the reset into a microtask: this is a reset in response to
      // `uid` becoming falsy (sign-out), not an update we want to run
      // synchronously in the render's commit phase.
      const t = setTimeout(() => {
        setOwned(new Set());
        setLoaded(false);
      }, 0);
      return () => clearTimeout(t);
    }
    const q = query(collection(db, "purchases"), where("uid", "==", uid));
    return onSnapshot(
      q,
      (snap) => {
        setOwned(new Set(snap.docs.map((d) => d.data().courseId as string)));
        setLoaded(true);
      },
      () => setLoaded(true),
    );
  }, [uid]);

  return { owned, loaded };
}
