import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  text,
  json,
  decimal,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const sceneTypes = ["workplace", "family", "relationship", "daily"] as const;
export type SceneType = (typeof sceneTypes)[number];

export const planTypes = ["single", "pack10", "unlimited"] as const;
export type PlanType = (typeof planTypes)[number];

export const users = mysqlTable("users", {
  walletAddress: varchar("wallet_address", { length: 42 }).primaryKey(),
  credits: int("credits").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generations = mysqlTable("generations", {
  id: varchar("id", { length: 25 }).primaryKey(),
  walletAddress: varchar("wallet_address", { length: 42 })
    .notNull()
    .references(() => users.walletAddress),
  scenario: text("scenario").notNull(),
  sceneType: mysqlEnum("scene_type", sceneTypes).notNull(),
  intensity: int("intensity").notNull(),
  output: json("output").$type<GenerationOutput>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = mysqlTable("payments", {
  txHash: varchar("tx_hash", { length: 66 }).primaryKey(),
  walletAddress: varchar("wallet_address", { length: 42 })
    .notNull()
    .references(() => users.walletAddress),
  plan: mysqlEnum("plan", planTypes).notNull(),
  amountUsdc: decimal("amount_usdc", { precision: 10, scale: 2 }).notNull(),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export interface GenerationOutput {
  rational: ResponseStyle;
  emotion: ResponseStyle;
  political: ResponseStyle;
  nuclear: ResponseStyle;
}

export interface ResponseStyle {
  label: string;
  content: string;
  damage: number;
}
