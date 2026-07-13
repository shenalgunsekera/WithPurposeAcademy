"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Simple consent notice. We only use cookies that are strictly necessary
 * (Firebase Auth session) plus Stripe's fraud-prevention cookies during
 * checkout, so this is an informational banner with acknowledgement.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(localStorage.getItem("wp-cookie-ack") !== "1");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[800] mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-line bg-felt-900/95 p-5 shadow-(--shadow-lg) backdrop-blur-xl sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-sm leading-relaxed text-cream-soft">
        This website uses cookies that are essential for signing in and for
        secure payment processing. See our{" "}
        <Link href="/cookies" className="text-gold-400 underline underline-offset-2">
          Cookie Policy
        </Link>
        .
      </p>
      <button
        type="button"
        className="btn-chip shrink-0 px-5 py-2 text-sm"
        onClick={() => {
          localStorage.setItem("wp-cookie-ack", "1");
          setShow(false);
        }}
      >
        Accept
      </button>
    </div>
  );
}
