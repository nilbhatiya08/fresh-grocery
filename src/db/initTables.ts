import { pool } from "./index";

/**
 * Creates all auth tables in MySQL if they don't exist yet.
 * Safe to call on every server start — idempotent.
 */
export async function initAuthTables(): Promise<{ success: boolean; error?: string }> {
  let connection: Awaited<ReturnType<typeof pool.getConnection>> | null = null;

  try {
    connection = await pool.getConnection();
  } catch (e: any) {
    console.warn("[DB] Cannot connect to MySQL — auth tables not initialized:", e.message);
    return { success: false, error: "Cannot connect to database" };
  }

  try {
    // Customers table — UNIQUE constraint on mobile enforced at DB level
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        mobile        VARCHAR(10) NOT NULL,
        email         VARCHAR(255) NULL,
        full_name     VARCHAR(255) NULL,
        gender        ENUM('male','female','other','prefer_not_to_say') NULL,
        date_of_birth DATE NULL,
        referral_code VARCHAR(50) NULL,
        points        INT NOT NULL DEFAULT 0,
        wallet_balance INT NOT NULL DEFAULT 0,
        status        ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT customers_mobile_unique UNIQUE (mobile),
        CONSTRAINT customers_email_unique UNIQUE (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // OTP Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS otp_requests (
        id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        mobile      VARCHAR(10) NOT NULL,
        otp_hash    VARCHAR(255) NOT NULL,
        expires_at  DATETIME NOT NULL,
        attempts    INT NOT NULL DEFAULT 0,
        verified    TINYINT(1) NOT NULL DEFAULT 0,
        ip_address  VARCHAR(45) NULL,
        user_agent  TEXT NULL,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mobile (mobile),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Auth Audit Log table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS auth_audit_log (
        id           CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        event        ENUM(
          'OTP_SENT','OTP_VERIFIED','OTP_FAILED','OTP_EXPIRED','OTP_RESENT',
          'LOGIN_SUCCESS','LOGIN_FAILED','REGISTRATION_STARTED','REGISTRATION_COMPLETED',
          'MOBILE_ALREADY_EXISTS','LOGOUT','RATE_LIMITED'
        ) NOT NULL,
        mobile       VARCHAR(10) NULL,
        customer_id  CHAR(36) NULL,
        ip_address   VARCHAR(45) NULL,
        user_agent   TEXT NULL,
        metadata     TEXT NULL,
        created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mobile (mobile),
        INDEX idx_customer (customer_id),
        INDEX idx_event (event),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Category Notify Me Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS category_notify_requests (
        id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        category_slug VARCHAR(100) NOT NULL,
        contact     VARCHAR(255) NOT NULL,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category_slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Product Notify Me Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_notify_requests (
        id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_name VARCHAR(255) NOT NULL,
        contact     VARCHAR(255) NOT NULL,
        status      ENUM('pending', 'notified', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product (product_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Order for Tomorrow Requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_tomorrow_requests (
        id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_name  VARCHAR(255) NOT NULL,
        quantity      VARCHAR(100) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        mobile        VARCHAR(15) NOT NULL,
        note          TEXT NULL,
        status        ENUM('pending', 'approved', 'fulfilled', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product_tomorrow (product_name),
        INDEX idx_mobile_tomorrow (mobile)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("[DB] MySQL auth tables initialized successfully");
    return { success: true };
  } catch (error: any) {
    console.error("[DB] Failed to initialize auth tables:", error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}
