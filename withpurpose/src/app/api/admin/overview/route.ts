import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase-admin";
import type { Course, Purchase, UserDoc } from "@/lib/site";

/** Everything the admin dashboard needs in one call. */
export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const db = adminDb();

    const [usersSnap, coursesSnap, purchasesSnap] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").limit(500).get(),
      db.collection("courses").orderBy("createdAt", "desc").get(),
      db.collection("purchases").orderBy("createdAt", "desc").limit(500).get(),
    ]);

    const users = usersSnap.docs.map((d) => d.data() as UserDoc);
    const courses = coursesSnap.docs.map((d) => ({ ...(d.data() as Course), id: d.id }));
    const purchases = purchasesSnap.docs.map((d) => d.data() as Purchase);

    const revenue = purchases.reduce((sum, p) => sum + (p.amount ?? 0), 0);

    return NextResponse.json({
      users,
      courses,
      purchases,
      stats: {
        totalUsers: users.length,
        pendingUsers: users.filter((u) => u.status === "pending").length,
        approvedUsers: users.filter((u) => u.status === "approved").length,
        totalSales: purchases.length,
        revenue,
        publishedCourses: courses.filter((c) => c.published).length,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "unauthenticated" ? 401 : msg === "forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
