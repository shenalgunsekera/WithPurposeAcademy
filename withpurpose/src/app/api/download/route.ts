import { NextResponse } from "next/server";
import { adminBucket, adminDb, requireUser } from "@/lib/firebase-admin";

/**
 * Returns a short-lived signed URL for a purchased course PDF.
 * `?mode=download` forces a file download; default renders inline (viewer).
 */
export async function GET(req: Request) {
  try {
    const { decoded, userDoc } = await requireUser(req);
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId") ?? "";
    const mode = url.searchParams.get("mode") ?? "view";

    const isAdmin = userDoc?.role === "admin";
    if (!isAdmin) {
      const owned = await adminDb()
        .collection("purchases")
        .where("uid", "==", decoded.uid)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();
      if (owned.empty) {
        return NextResponse.json({ error: "You do not own this course." }, { status: 403 });
      }
    }

    const courseSnap = await adminDb().collection("courses").doc(courseId).get();
    if (!courseSnap.exists) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    const { pdfPath, title } = courseSnap.data()!;

    const [signed] = await adminBucket()
      .file(pdfPath)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
        responseDisposition:
          mode === "download"
            ? `attachment; filename="${String(title).replace(/[^\w \-]/g, "")}.pdf"`
            : "inline",
        responseType: "application/pdf",
      });

    return NextResponse.json({ url: signed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
