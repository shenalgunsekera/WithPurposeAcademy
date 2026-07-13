import { type ReactNode } from "react";

/** Shared shell for policy pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="section-pad pt-36">
      <div className="container-wp max-w-3xl">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] tracking-wide text-cream">{title}</h1>
        <p className="mt-2 text-sm text-cream-faint">Last updated: {updated}</p>
        <div className="mt-10 flex flex-col gap-4 text-[0.98rem] leading-[1.85] text-cream-soft [&_a]:text-gold-400 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:tracking-wide [&_h2]:text-cream [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
