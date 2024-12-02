import { boolean, char, date, integer, pgTable, time, uuid, varchar } from "drizzle-orm/pg-core";

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
    Table for obtaining the service history
*/
export const serviceHistory = pgTable("serviceHistory", {
    id: uuid().defaultRandom().notNull(),
    serviceID: uuid().notNull(),
    reachableStatus: boolean().default(false),
    // Time string because of storing UNIX epoch
    time: varchar({length: 256}).notNull(),
})

/*
    Table for "integrations," which are just connections to stuff like webhooks
*/
export const integrations = pgTable("integrations", {
    id: uuid().defaultRandom().notNull(),
    serviceID: uuid().notNull(),
    integrationName: varchar({length: 256}).notNull(),
    integrationType: varchar({length: 256}).notNull(),
    integrationURL: varchar({length: 256}).notNull(),
})

/*
    Our table for manager
*/
export const manager = pgTable("manager", {
    // Get ID of service as a UUID
    id: uuid().defaultRandom().notNull(),
    name: varchar({length: 255}).notNull(),
    pagePublished: boolean().notNull(),
})

/*
    Table for storing incidents
*/
export const incidents = pgTable("incidents", {
    id: uuid().defaultRandom().notNull(),
    name: varchar({length: 255}).notNull(),
    description: varchar({length: 1024}).notNull(),
    firstCreated: varchar({length: 256}).notNull(),
    lastUpdated: varchar({length: 256}).notNull(),
})

/*
    Table for storing the hierarchy of services
*/
export const serviceHierarchy = pgTable("serviceHierarchy", {
    trueID: uuid().notNull().primaryKey().defaultRandom(),
    id: integer(),
    serviceID: uuid().notNull(),
    parentID: uuid().notNull(),
})