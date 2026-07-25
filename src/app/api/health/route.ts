import { pool } from "@/db/index";
import { initAuthTables } from "@/db/initTables";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pool.execute("SELECT 1");
    const initRes = await initAuthTables();
    return Response.json({ ok: true, db: "connected", init: initRes });
  } catch (error: any) {
    return Response.json({ ok: false, error: error?.message || "Unknown DB error" }, { status: 500 });
  }
}
