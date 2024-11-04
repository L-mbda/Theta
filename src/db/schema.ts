import { char, integer, pgTable, varchar } from "drizzle-orm/pg-core";

/*
    Our user table for the data within the database
*/
export const user = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    username: varchar({length: 100}).notNull(),
    password: varchar({length: 256}),
    salt1: varchar({length: 512}),
    salt2: varchar({length: 512}),
    role: char({enum: ["owner", "admin", "user"]})
})