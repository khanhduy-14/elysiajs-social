import {
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const user = pgTable(
  "user",
  {
    // Internal auto-incrementing ID
    id: serial("id").primaryKey(),

    // External facing ID for APIs
    publicId: varchar("public_id")
      .$defaultFn(() => createId())
      .notNull(),

    // Authentication fields
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),

    // Profile fields
    name: varchar("name").notNull(),
    avatarUrl: varchar("avatar_url", { length: 512 }),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Primary API lookup - most important index
    publicIdIdx: uniqueIndex("user_public_id_idx").on(table.publicId),

    // Email search functionality
    emailIdx: index("user_email_idx").on(table.email),
  }),
);

// TypeScript types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
