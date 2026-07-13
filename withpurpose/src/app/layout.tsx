import type { Metadata } from "next";
import { Cinzel, Figtree } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoader } from "@/components/page-loader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CookieBanner } from "@/components/cookie-banner";
import { site } from "@/lib/site";

// Every page reads live Firebase auth/user state (via AuthProvider), so
// nothing here can be meaningfully static — render on request instead of
// attempting to prerender at build time.
export const dynamic = "force-dynamic";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-svh flex-col antialiased">
        <noscript>
          <style>{".wp-loader{display:none}"}</style>
        </noscript>
        <AuthProvider>
          <PageLoader />
          <SmoothScroll />
          <div className="grain-overlay" aria-hidden />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[900] focus:rounded-md focus:bg-chip-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
