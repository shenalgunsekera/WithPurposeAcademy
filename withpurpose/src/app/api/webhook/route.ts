import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { stripe } from "@/lib/stripe";

/**
 * Stripe webhook: on successful checkout, record the purchase so the buyer's
 * library unlocks. Idempotent — keyed by the Checkout Session id.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    const courseId = session.metadata?.courseId;

    if (uid && courseId && session.payment_status === "paid") {
      const ref = adminDb().collection("purchases").doc(session.id);
      const existing = await ref.get();
      if (!existing.exists) {
        const courseSnap = await adminDb().collection("courses").doc(courseId).get();
        await ref.set({
          id: session.id,
          uid,
          courseId,
          courseTitle: courseSnap.exists ? courseSnap.data()!.title : courseId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          stripeSessionId: session.id,
          createdAt: Date.now(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
