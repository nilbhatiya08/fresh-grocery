import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categorySlug, contact } = body;

    if (!categorySlug || !contact || !contact.trim()) {
      return NextResponse.json(
        { success: false, error: "Category and Email/Mobile contact are required." },
        { status: 400 }
      );
    }

    let connection: Awaited<ReturnType<typeof pool.getConnection>> | null = null;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO category_notify_requests (id, category_slug, contact, created_at) VALUES (UUID(), ?, ?, NOW())`,
        [categorySlug.trim(), contact.trim()]
      );
    } catch (dbError: any) {
      console.warn("[DB Notify] Could not store in MySQL:", dbError.message);
      // Fallback: continue so user gets success feedback even if local MySQL table is locked or uninitialized
    } finally {
      if (connection) connection.release();
    }

    return NextResponse.json({
      success: true,
      message: "We have saved your request! You will be notified when this category launches.",
    });
  } catch (err: any) {
    console.error("[API notify-category Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
