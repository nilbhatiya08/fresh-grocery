import sqlite3 from "sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const dbPath = path.resolve("grocery.db");

// Store on globalThis to prevent multiple instances during development hot-reloads
const globalForDb = globalThis as typeof globalThis & {
  __sqliteDb?: sqlite3.Database;
};

export const db: sqlite3.Database =
  globalForDb.__sqliteDb ??
  new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("[DB] Failed to connect to SQLite:", err.message);
    } else {
      console.log("[DB] SQLite database connected at:", dbPath);
    }
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sqliteDb = db;
}

// Enable WAL mode and busy timeout
db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA busy_timeout = 10000");
});

function translateSql(sql: string): string {
  let s = sql;

  // Replace MySQL UUID() with a generated UUID
  while (s.includes("UUID()")) {
    s = s.replace("UUID()", `'${randomUUID()}'`);
  }
  while (s.includes("uuid()")) {
    s = s.replace("uuid()", `'${randomUUID()}'`);
  }

  // Replace NOW() with UTC datetime for SQLite consistency
  s = s.replace(/\bNOW\(\)/g, "datetime('now')");
  s = s.replace(/\bnow\(\)/g, "datetime('now')");

  // Replace UTC_TIMESTAMP() - INTERVAL X MINUTE with datetime('now', '-X minutes')
  s = s.replace(/UTC_TIMESTAMP\(\)\s*-\s*INTERVAL\s*(\d+)\s*MINUTE/gi, "datetime('now', '-$1 minutes')");

  // Replace UTC_TIMESTAMP() with datetime('now')
  s = s.replace(/UTC_TIMESTAMP\(\)/gi, "datetime('now')");

  return s;
}

// Promisified execution function
function executeSql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const translated = translateSql(sql);
  return new Promise((resolve, reject) => {
    db.all(translated, params, (err, rows) => {
      if (err) {
        console.error(`[DB Error] SQL: ${translated} | Params:`, params, "| Error:", err.message);
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
}

// Pool interface mapping to SQLite execution
export const pool = {
  execute: async <T = any>(sql: string, values?: any[]): Promise<[T, any]> => {
    const rows = await executeSql(sql, values);
    return [rows as unknown as T, null];
  },
  getConnection: async () => {
    return {
      execute: async <T = any>(sql: string, values?: any[]): Promise<[T, any]> => {
        const rows = await executeSql(sql, values);
        return [rows as unknown as T, null];
      },
      release: () => {
        // No-op for SQLite shared connection
      }
    };
  }
};

// Helper: query
export async function query<T = any>(
  sql: string,
  values?: any[]
): Promise<T[]> {
  return executeSql<T>(sql, values);
}

// Helper: getConnection
export async function getConnection() {
  return pool.getConnection();
}
