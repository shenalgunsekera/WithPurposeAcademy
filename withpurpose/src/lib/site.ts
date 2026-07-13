export const site = {
  name: "With Purpose Academy",
  tagline: "Learn poker the disciplined way",
  description:
    "With Purpose Academy is a poker education platform. Structured, professional course material that turns guesswork into strategy.",
  email: "shenalgd@gmail.com",
  /** TODO: replace with the registered business address before going live */
  address: "Colombo, Sri Lanka",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
] as const;

export type UserStatus = "pending" | "approved" | "suspended";

export type UserDoc = {
  uid: string;
  name: string;
  email: string;
  nic: string;
  photoURL?: string;
  status: UserStatus;
  role: "user" | "admin";
  createdAt: number;
};

export type Course = {
  id: string;
  title: string;
  summary: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  /** Price in USD cents */
  priceUsd: number;
  /** Storage path of the PDF, e.g. courses/abc.pdf */
  pdfPath: string;
  pages: number;
  published: boolean;
  createdAt: number;
};

export type Purchase = {
  id: string;
  uid: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  createdAt: number;
};

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
