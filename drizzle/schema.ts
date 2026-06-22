import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Checklist Records Tables
export const checklistRecords = mysqlTable("checklistRecords", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["po", "capsula", "gel"]).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  client: varchar("client", { length: 255 }).notNull(),
  formulationCode: varchar("formulationCode", { length: 255 }).notNull(),
  accompanimentReason: varchar("accompanimentReason", { length: 100 }),
  productionDate: timestamp("productionDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChecklistRecord = typeof checklistRecords.$inferSelect;
export type InsertChecklistRecord = typeof checklistRecords.$inferInsert;

// Pre-Production Data
export const preProductionData = mysqlTable("preProductionData", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  developmentNeeded: varchar("developmentNeeded", { length: 10 }),
  orderConference: varchar("orderConference", { length: 50 }),
  conferenceDate: timestamp("conferenceDate"),
  datasulCode: varchar("datasulCode", { length: 100 }),
  packaging1: varchar("packaging1", { length: 20 }),
  packaging2: varchar("packaging2", { length: 20 }),
  packaging3: varchar("packaging3", { length: 20 }),
  shippingBox: varchar("shippingBox", { length: 20 }),
  label: varchar("label", { length: 20 }),
  scoop: varchar("scoop", { length: 20 }),
  densityTest1: text("densityTest1"),
  densityTest2: text("densityTest2"),
  densityTest3: text("densityTest3"),
  densityAverage: text("densityAverage"),
  observations: text("observations"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PreProductionData = typeof preProductionData.$inferSelect;
export type InsertPreProductionData = typeof preProductionData.$inferInsert;

// Mixing Process Data
export const mixingProcessData = mysqlTable("mixingProcessData", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  mixerUsed: varchar("mixerUsed", { length: 255 }),
  mixingOrder: text("mixingOrder"),
  roomTemperature: text("roomTemperature"),
  relativeHumidity: text("relativeHumidity"),
  mixingTime: text("mixingTime"),
  initialTankTemperature: text("initialTankTemperature"),
  // Viscosity Temperature Tank (for Gel)
  viscTempTankViscosity: text("viscTempTankViscosity"),
  viscTempTankTemperature: text("viscTempTankTemperature"),
  viscTempTankRpm: text("viscTempTankRpm"),
  viscTempTankTorque: text("viscTempTankTorque"),
  viscTempTankSpindle: text("viscTempTankSpindle"),
  // Viscosity 1
  visc1Viscosity: text("visc1Viscosity"),
  visc1Temperature: text("visc1Temperature"),
  visc1Rpm: text("visc1Rpm"),
  visc1Torque: text("visc1Torque"),
  visc1Spindle: text("visc1Spindle"),
  // Viscosity 2
  visc2Viscosity: text("visc2Viscosity"),
  visc2Temperature: text("visc2Temperature"),
  visc2Rpm: text("visc2Rpm"),
  visc2Torque: text("visc2Torque"),
  visc2Spindle: text("visc2Spindle"),
  // Density Analysis for Powder (Processo Mistura)
  densityMixing1: text("densityMixing1"),
  densityMixing2: text("densityMixing2"),
  densityMixing3: text("densityMixing3"),
  densityMixingAverage: text("densityMixingAverage"),
  // Common fields
  occurrence: varchar("occurrence", { length: 10 }),
  heatedPulmonaryTank: varchar("heatedPulmonaryTank", { length: 10 }),
  observations: text("observations"),
  scoopConform: varchar("scoopConform", { length: 20 }),
  sensorialReleased: varchar("sensorialReleased", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MixingProcessData = typeof mixingProcessData.$inferSelect;
export type InsertMixingProcessData = typeof mixingProcessData.$inferInsert;

// Packaging Process Data
export const packagingProcessData = mysqlTable("packagingProcessData", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  data: text("data"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PackagingProcessData = typeof packagingProcessData.$inferSelect;
export type InsertPackagingProcessData = typeof packagingProcessData.$inferInsert;

// Post-Production Data
export const postProductionData = mysqlTable("postProductionData", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  data: text("data"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostProductionData = typeof postProductionData.$inferSelect;
export type InsertPostProductionData = typeof postProductionData.$inferInsert;

// Responsible Personnel
export const responsiblePersonnel = mysqlTable("responsiblePersonnel", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  qualityResponsible: varchar("qualityResponsible", { length: 255 }).notNull(),
  innovationResponsible: varchar("innovationResponsible", { length: 255 }).notNull(),
  innovationVerification: varchar("innovationVerification", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResponsiblePersonnel = typeof responsiblePersonnel.$inferSelect;
export type InsertResponsiblePersonnel = typeof responsiblePersonnel.$inferInsert;

// Evidence/Photos
export const evidencePhotos = mysqlTable("evidencePhotos", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  photoUrl: text("photoUrl").notNull(),
  photoKey: varchar("photoKey", { length: 500 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type EvidencePhoto = typeof evidencePhotos.$inferSelect;
export type InsertEvidencePhoto = typeof evidencePhotos.$inferInsert;


