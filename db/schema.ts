import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const licenses = pgTable(
  "licenses",
  {
    id: text("id").primaryKey().default(sql`(gen_random_uuid()::text)`),
    ownerEmail: text("owner_email"),
    plan: text("plan", { enum: ["free", "pro"] }).notNull().default("free"),
    credits: integer("credits").notNull().default(100),
    deviceStatus: text("device_status", { enum: ["livre", "vinculado"] }).notNull().default("livre"),
    status: text("status", { enum: ["ativa", "banida"] }).notNull().default("ativa"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("licenses_plan_check", sql`${table.plan} in ('free', 'pro')`),
    check("licenses_credits_check", sql`${table.credits} >= 0`),
    check("licenses_device_status_check", sql`${table.deviceStatus} in ('livre', 'vinculado')`),
    check("licenses_status_check", sql`${table.status} in ('ativa', 'banida')`),
  ],
);

export type License = typeof licenses.$inferSelect;
