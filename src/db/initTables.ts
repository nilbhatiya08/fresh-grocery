import { pool } from "./index";

const UUID_DEFAULT = `(
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-' ||
  '4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', (abs(random()) % 4) + 1, 1) || substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
  lower(hex(randomblob(6)))
)`;

/**
 * Creates all auth tables in SQLite if they don't exist yet.
 * Safe to call on every server start — idempotent.
 */
export async function initAuthTables(): Promise<{ success: boolean; error?: string }> {
  let connection: any = null;

  try {
    connection = await pool.getConnection();
  } catch (e: any) {
    console.warn("[DB] Cannot connect to SQLite — auth tables not initialized:", e.message);
    return { success: false, error: "Cannot connect to database" };
  }

  try {
    // 1. Customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id            TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        mobile        TEXT NOT NULL,
        email         TEXT NULL,
        full_name     TEXT NULL,
        gender        TEXT CHECK(gender IN ('male','female','other','prefer_not_to_say')) NULL,
        date_of_birth TEXT NULL,
        referral_code TEXT NULL,
        points        INTEGER NOT NULL DEFAULT 0,
        wallet_balance INTEGER NOT NULL DEFAULT 0,
        status        TEXT CHECK(status IN ('active','suspended','deleted')) NOT NULL DEFAULT 'active',
        created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT customers_mobile_unique UNIQUE (mobile),
        CONSTRAINT customers_email_unique UNIQUE (email)
      );
    `);

    // 2. OTP Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS otp_requests (
        id          TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        mobile      TEXT NOT NULL,
        otp_hash    TEXT NOT NULL,
        expires_at  TEXT NOT NULL,
        attempts    INTEGER NOT NULL DEFAULT 0,
        verified    INTEGER NOT NULL DEFAULT 0,
        ip_address  TEXT NULL,
        user_agent  TEXT NULL,
        created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Auth Audit Log table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS auth_audit_log (
        id           TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        event        TEXT NOT NULL,
        mobile       TEXT NULL,
        customer_id  TEXT NULL,
        ip_address   TEXT NULL,
        user_agent   TEXT NULL,
        metadata     TEXT NULL,
        created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Category Notify Me Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS category_notify_requests (
        id          TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        category_slug TEXT NOT NULL,
        contact     TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Product Notify Me Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_notify_requests (
        id          TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        product_name TEXT NOT NULL,
        contact     TEXT NOT NULL,
        status      TEXT CHECK(status IN ('pending', 'notified', 'cancelled')) NOT NULL DEFAULT 'pending',
        created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Order for Tomorrow Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_tomorrow_requests (
        id            TEXT PRIMARY KEY DEFAULT ${UUID_DEFAULT},
        product_name  TEXT NOT NULL,
        quantity      TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        mobile        TEXT NOT NULL,
        note          TEXT NULL,
        status        TEXT CHECK(status IN ('pending', 'approved', 'fulfilled', 'cancelled')) NOT NULL DEFAULT 'pending',
        created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ──────────────────────── Create Indexes ────────────────────────
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_requests (mobile);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_requests (expires_at);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_audit_mobile ON auth_audit_log (mobile);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_audit_customer ON auth_audit_log (customer_id);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_audit_event ON auth_audit_log (event);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_audit_created ON auth_audit_log (created_at);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_category_notify ON category_notify_requests (category_slug);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_product_notify ON product_notify_requests (product_name);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_order_tomorrow_product ON order_tomorrow_requests (product_name);`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_order_tomorrow_mobile ON order_tomorrow_requests (mobile);`);

    console.log("[DB] SQLite database tables initialized successfully");
    return { success: true };
  } catch (error: any) {
    console.error("[DB] Failed to initialize SQLite tables:", error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}
