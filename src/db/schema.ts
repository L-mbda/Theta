import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    username: varchar({length: 100}).notNull(),
    password: varchar({length: 256}),
})