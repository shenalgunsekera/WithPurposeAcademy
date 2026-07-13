import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase-admin";

/** Approve or suspend a user account. */
export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const { uid, action } = await req.json();

    if (!uid || !["approve", "suspend", "pending"].includes(action)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const status =
      action === "approve" ? "approved" : action === "suspend" ? "suspended" : "pending";
    await adminDb().collection("users").doc(String(uid)).set({ status }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : msg === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
