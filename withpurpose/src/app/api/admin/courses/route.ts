import { NextResponse } from "next/server";
import { adminBucket, adminDb, requireAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

/**
 * Create a course. Multipart form: title, summary, description, level,
 * priceUsd (dollars, e.g. "49.99"), pages, published, pdf (file).
 */
export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const form = await req.formData();

    const title = String(form.get("title") ?? "").trim();
    const summary = String(form.get("summary") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const level = String(form.get("level") ?? "Beginner");
    const priceUsd = Math.round(parseFloat(String(form.get("priceUsd") ?? "0")) * 100);
    const pages = parseInt(String(form.get("pages") ?? "0"), 10) || 0;
    const published = String(form.get("published")) === "true";
    const pdf = form.get("pdf");

    if (title.length < 3) {
      return NextResponse.json({ error: "Title is too short." }, { status: 400 });
    }
    if (!LEVELS.includes(level)) {
      return NextResponse.json({ error: "Invalid level." }, { status: 400 });
    }
    if (!Number.isFinite(priceUsd) || priceUsd < 50) {
      return NextResponse.json(
        { error: "Price must be at least $0.50 (Stripe minimum)." },
        { status: 400 },
      );
    }
    if (!(pdf instanceof File) || pdf.type !== "application/pdf") {
      return NextResponse.json({ error: "Please attach the course PDF." }, { status: 400 });
    }
    if (pdf.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 50 MB." }, { status: 400 });
    }

    const ref = adminDb().collection("courses").doc();
    const pdfPath = `courses/${ref.id}.pdf`;
    const buffer = Buffer.from(await pdf.arrayBuffer());
    await adminBucket().file(pdfPath).save(buffer, {
      contentType: "application/pdf",
      resumable: false,
    });

    await ref.set({
      id: ref.id,
      title,
      summary,
      description,
      level,
      priceUsd,
      pages,
      pdfPath,
      published,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : msg === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

/** Update course fields (and optionally replace the PDF). Multipart form with id. */
export async function PATCH(req: Request) {
  try {
    await requireAdmin(req);
    const form = await req.formData();
    const id = String(form.get("id") ?? "");
    const ref = adminDb().collection("courses").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const patch: Record<string, unknown> = {};
    if (form.has("title")) patch.title = String(form.get("title")).trim();
    if (form.has("summary")) patch.summary = String(form.get("summary")).trim();
    if (form.has("description")) patch.description = String(form.get("description")).trim();
    if (form.has("level")) patch.level = String(form.get("level"));
    if (form.has("pages")) patch.pages = parseInt(String(form.get("pages")), 10) || 0;
    if (form.has("published")) patch.published = String(form.get("published")) === "true";
    if (form.has("priceUsd")) {
      const cents = Math.round(parseFloat(String(form.get("priceUsd"))) * 100);
      if (!Number.isFinite(cents) || cents < 50) {
        return NextResponse.json(
          { error: "Price must be at least $0.50 (Stripe minimum)." },
          { status: 400 },
        );
      }
      patch.priceUsd = cents;
    }

    const pdf = form.get("pdf");
    if (pdf instanceof File && pdf.size > 0) {
      if (pdf.type !== "application/pdf") {
        return NextResponse.json({ error: "Replacement file must be a PDF." }, { status: 400 });
      }
      const buffer = Buffer.from(await pdf.arrayBuffer());
      await adminBucket().file(snap.data()!.pdfPath).save(buffer, {
        contentType: "application/pdf",
        resumable: false,
      });
    }

    await ref.set(patch, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : msg === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

/** Delete a course and its PDF. Body: { id } */
export async function DELETE(req: Request) {
  try {
    await requireAdmin(req);
    const { id } = await req.json();
    const ref = adminDb().collection("courses").doc(String(id));
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    await adminBucket()
      .file(snap.data()!.pdfPath)
      .delete({ ignoreNotFound: true });
    await ref.delete();

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : msg === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
