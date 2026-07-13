import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="July 13, 2026">
      <p>
        We want you to buy with confidence. Because our products are digital
        goods delivered instantly, our refund policy balances fairness to you
        with protection against misuse.
      </p>

      <h2>1. 14-day refund window</h2>
      <p>
        You may request a full refund within <strong>14 days</strong> of
        purchase, provided the course material has{" "}
        <strong>not been opened in the reader or downloaded</strong>. Once
        material has been accessed, the product is considered consumed and the
        purchase becomes non-refundable, except where required by law or in
        the situations below.
      </p>

      <h2>2. Always refunded</h2>
      <ul>
        <li>Duplicate charges for the same course.</li>
        <li>Payment taken but the course never appeared in your library and we cannot restore access.</li>
        <li>A file that is corrupted or materially different from its description, where we cannot supply a corrected copy.</li>
      </ul>

      <h2>3. How to request a refund</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> from the
        address on your account with your purchase date and the course name.
        We reply within 1 business day, and approved refunds are returned to
        your original payment method by Stripe, typically within 5 to 10
        business days.
      </p>

      <h2>4. Chargebacks</h2>
      <p>
        Please contact us before disputing a charge with your bank; almost all
        issues can be resolved faster directly. Fraudulent chargebacks on
        accessed material may result in account suspension.
      </p>

      <h2>5. Contact</h2>
      <p>
        {site.name}, {site.address}. Email:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
