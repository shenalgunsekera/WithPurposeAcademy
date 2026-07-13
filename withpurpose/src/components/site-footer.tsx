import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { site, nav } from "@/lib/site";

const legal = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refunds", label: "Refund Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-felt-950">
      <div aria-hidden className="glow-red pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />

      <div className="container-wp relative section-pad-tight">
        <div className="grid gap-10 py-6 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="" width={96} height={96} className="size-12 rounded-xl object-cover" />
              <span className="font-display text-xl leading-tight tracking-wide text-cream">
                With Purpose
                <span className="block text-[0.65rem] font-bold tracking-[0.3em] text-gold-500 uppercase">
                  Academy
                </span>
              </span>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-cream-soft">
              Structured poker education. Study with discipline, play with
              purpose.
            </p>
            <p className="text-xs leading-relaxed text-cream-faint">
              With Purpose Academy sells educational material only. We do not
              operate games of chance, accept wagers, or provide gambling
              services. Course content is intended for players aged 18 and
              over.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 text-xs font-bold tracking-[0.18em] text-cream-faint uppercase">
              Explore
            </h2>
            <ul className="flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-[0.95rem] text-cream-soft hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/library" className="link-underline text-[0.95rem] text-cream-soft hover:text-white">
                  My Library
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-bold tracking-[0.18em] text-cream-faint uppercase">
              Legal & Contact
            </h2>
            <ul className="flex flex-col gap-2.5">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-[0.95rem] text-cream-soft hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-2 text-[0.95rem] text-cream-soft">
                <Mail className="size-4 text-gold-500" aria-hidden />
                <a href={`mailto:${site.email}`} className="link-underline hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-[0.95rem] text-cream-soft">
                <MapPin className="size-4 text-gold-500" aria-hidden />
                {site.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-line-soft pt-5 text-sm text-cream-faint sm:flex-row">
          <p>Copyright © {new Date().getFullYear()} {site.name}. All Rights Reserved.</p>
          <p className="font-display italic">Study with discipline. Play with purpose.</p>
        </div>
      </div>
    </footer>
  );
}
