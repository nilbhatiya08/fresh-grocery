import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __farmoraPool?: mysql.Pool;
};

export const pool: mysql.Pool =
  globalForDb.__farmoraPool ??
  mysql.createPool({
    uri: databaseUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__farmoraPool = pool;
}

// Helper: get a connection, run a query, release
export async function query<T = any>(
  sql: string,
  values?: any[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, values);
  return rows as T[];
}

// Helper: get a connection for transactions
export async function getConnection() {
  return pool.getConnection();
}
