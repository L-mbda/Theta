import { boolean, char, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

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
    role: varchar({enum: ["owner", "admin", "user"]})
})

/*
    Our table for services
*/
export const services = pgTable("service", {
    // Get ID of service as a UUID
    id: uuid().defaultRandom().notNull(),
    name: varchar({length: 255}).notNull(),
    monitorURL: varchar({length: 256}).notNull(),
    monitorType: varchar({length: 256}).notNull(),
    heartbeatInterval: integer().notNull(),
    maxRetries: integer().notNull(),  
    managerID: uuid(),
})

/*
    Our table for manager
*/
export const manager = pgTable("manager", {
    // Get ID of service as a UUID
    id: uuid().defaultRandom().notNull(),
    name: varchar({length: 255}).notNull(),
    loginOnly: boolean().notNull(),
})