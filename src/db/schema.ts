import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
  pgEnum,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ──────────────────────── Enums ────────────────────────
export const customerStatusEnum = pgEnum("customer_status", [
  "active",
  "suspended",
  "deleted",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other", "prefer_not_to_say"]);

export const auditEventEnum = pgEnum("audit_event", [
  "OTP_SENT",
  "OTP_VERIFIED",
  "OTP_FAILED",
  "OTP_EXPIRED",
  "OTP_RESENT",
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "REGISTRATION_STARTED",
  "REGISTRATION_COMPLETED",
  "MOBILE_ALREADY_EXISTS",
  "LOGOUT",
  "RATE_LIMITED",
]);

// ──────────────────────── Customers ────────────────────────
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    mobile: varchar("mobile", { length: 10 }).notNull(),
    email: varchar("email", { length: 255 }),
    fullName: varchar("full_name", { length: 255 }),
    gender: genderEnum("gender"),
    dateOfBirth: date("date_of_birth"),
    referralCode: varchar("referral_code", { length: 50 }),
    points: integer("points").notNull().default(0),
    walletBalance: integer("wallet_balance").notNull().default(0),
    status: customerStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  },
  (table) => [
    uniqueIndex("customers_mobile_unique_idx").on(table.mobile),
    uniqueIndex("customers_email_unique_idx").on(table.email),
  ]
);

// ──────────────────────── OTP Requests ────────────────────────
export const otpRequests = pgTable(
  "otp_requests",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    mobile: varchar("mobile", { length: 10 }).notNull(),
    // Store hashed OTP for security
    otpHash: varchar("otp_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    attempts: integer("attempts").notNull().default(0),
    verified: boolean("verified").notNull().default(false),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
  },
  (table) => [
    index("otp_requests_mobile_idx").on(table.mobile),
    index("otp_requests_expires_idx").on(table.expiresAt),
  ]
);

// ──────────────────────── Auth Audit Log ────────────────────────
export const authAuditLog = pgTable(
  "auth_audit_log",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    event: auditEventEnum("event").notNull(),
    mobile: varchar("mobile", { length: 10 }),
    customerId: uuid("customer_id"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    metadata: text("metadata"), // JSON string for extra context
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
  },
  (table) => [
    index("audit_log_mobile_idx").on(table.mobile),
    index("audit_log_customer_idx").on(table.customerId),
    index("audit_log_event_idx").on(table.event),
    index("audit_log_created_idx").on(table.createdAt),
  ]
);
