"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authedJson } from "@/lib/api";
import { isValidNic } from "@/lib/validate";
import { useAuth } from "@/context/auth";

/**
 * Shown after Google sign-in (or any account missing a NIC): collects the
 * NIC and confirms the display name before the account goes to review.
 */
function CompleteProfileInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile, profileLoaded, needsProfile } = useAuth();
  const [name, setName] = useState("");
  const [seededFrom, setSeededFrom] = useState<string | null>(null);
  const [nic, setNic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const next = params.get("next") || "/courses";

  useEffect(() => {
    if (user === null) router.replace("/login");
    if (user && profileLoaded && !needsProfile) router.replace(next);
  }, [user, profileLoaded, needsProfile, router, next]);

  // Seed the name field once we know who's signed in, without clobbering
  // anything the user has already typed. This is the "adjust state during
  // render" pattern React recommends instead of an effect for this case.
  const seed = (profile?.name ?? user?.displayName ?? "").trim();
  if (user && seed && seed !== seededFrom) {
    setSeededFrom(seed);
    setName(seed);
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!isValidNic(nic))
      return setError("Please enter a valid NIC number (9 digits + V/X, or 12 digits).");

    setBusy(true);
    try {
      await authedJson("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), nic }),
      });
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative flex min-h-svh items-center justify-center px-4 py-28">
      <div aria-hidden className="glow-gold pointer-events-none absolute inset-x-0 top-0 h-1/2" />

      <div className="surface relative w-full max-w-md p-8 shadow-(--shadow-lg)">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image src="/logo.webp" alt="" width={120} height={120} className="size-16 rounded-2xl object-cover" />
          <h1 className="font-display text-2xl tracking-wide">One last step</h1>
          <p className="text-sm text-cream-soft">
            You&rsquo;re signed in as <span className="text-cream">{user.email}</span>. To finish
            setting up your account, confirm your name and NIC number.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="cp-name" className="mb-1 block text-sm font-medium text-cream-soft">
              Full name
            </label>
            <input
              id="cp-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              placeholder="As it appears on your NIC"
            />
          </div>
          <div>
            <label htmlFor="cp-nic" className="mb-1 block text-sm font-medium text-cream-soft">
              NIC number
            </label>
            <input
              id="cp-nic"
              type="text"
              required
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              className="field"
              placeholder="e.g. 923456789V or 199234567890"
            />
            <p className="mt-1 text-xs text-cream-faint">
              Used to verify your identity before purchases are enabled.
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-chip mt-1 w-full">
            {busy ? "Saving…" : "Complete profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileInner />
    </Suspense>
  );
}
