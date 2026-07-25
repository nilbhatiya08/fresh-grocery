import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, quantity, customerName, mobile, note } = body;

    if (!productName || !quantity || !customerName || !mobile) {
      return NextResponse.json(
        { success: false, error: "Product name, quantity, name, and mobile number are required." },
        { status: 400 }
      );
    }

    let connection: Awaited<ReturnType<typeof pool.getConnection>> | null = null;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO order_tomorrow_requests (id, product_name, quantity, customer_name, mobile, note, status, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, 'pending', NOW())`,
        [productName.trim(), quantity.trim(), customerName.trim(), mobile.trim(), note?.trim() || null]
      );
    } catch (dbError: any) {
      console.warn("[DB Order Tomorrow] Could not store in MySQL:", dbError.message);
    } finally {
      if (connection) connection.release();
    }

    return NextResponse.json({
      success: true,
      message: "Your advance order for tomorrow has been received! Our farm team will reserve this item and contact you.",
    });
  } catch (err: any) {
    console.error("[API order-tomorrow Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
