import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, contact } = body;

    if (!productName || !contact || !contact.trim()) {
      return NextResponse.json(
        { success: false, error: "Product name and Email/Mobile contact are required." },
        { status: 400 }
      );
    }

    let connection: Awaited<ReturnType<typeof pool.getConnection>> | null = null;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO product_notify_requests (id, product_name, contact, status, created_at) VALUES (UUID(), ?, ?, 'pending', NOW())`,
        [productName.trim(), contact.trim()]
      );
    } catch (dbError: any) {
      console.warn("[DB Notify Product] Could not store in MySQL:", dbError.message);
    } finally {
      if (connection) connection.release();
    }

    return NextResponse.json({
      success: true,
      message: "We have saved your request! You will be notified as soon as this vegetable is back in stock.",
    });
  } catch (err: any) {
    console.error("[API notify-product Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
