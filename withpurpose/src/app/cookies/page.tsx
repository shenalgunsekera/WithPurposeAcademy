import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="July 13, 2026">
      <p>
        This site uses a small number of cookies and similar browser storage,
        all of which are either strictly necessary for the site to work or
        used by our payment processor to prevent fraud.
      </p>

      <h2>1. Strictly necessary</h2>
      <ul>
        <li>
          <strong>Firebase Authentication:</strong> keeps you signed in to your
          account between visits. Without it, sign-in does not work.
        </li>
        <li>
          <strong>Cookie notice acknowledgement:</strong> a single local
          storage entry that remembers you dismissed the cookie banner.
        </li>
      </ul>

      <h2>2. Payment processing</h2>
      <p>
        During checkout, <strong>Stripe</strong> sets cookies on its checkout
        pages for security and fraud prevention. These are governed by
        Stripe&rsquo;s own cookie policy.
      </p>

      <h2>3. What we do not use</h2>
      <ul>
        <li>No advertising cookies.</li>
        <li>No cross-site tracking.</li>
        <li>No third-party analytics trackers.</li>
      </ul>

      <h2>4. Managing cookies</h2>
      <p>
        You can clear or block cookies in your browser settings at any time.
        Blocking the strictly necessary cookies will prevent sign-in and
        purchasing from working.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
