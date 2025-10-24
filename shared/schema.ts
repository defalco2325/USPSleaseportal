import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const valuations = pgTable("valuations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Contact Information (Stage 1)
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Property Details (Stage 2)
  propertyAddress: text("property_address"),
  annualRent: integer("annual_rent"),
  annualPropertyTaxes: integer("annual_property_taxes"),
  taxesReimbursed: boolean("taxes_reimbursed"),
  annualInsurance: integer("annual_insurance"),
  squareFootage: integer("square_footage"),
  
  // Calculated Values
  lowEstimatedValue: integer("low_estimated_value"),
  highEstimatedValue: integer("high_estimated_value"),
  
  // Meta
  stage1Completed: boolean("stage1_completed").notNull().default(true),
  stage2Completed: boolean("stage2_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});

export type InsertValuation = z.infer<typeof insertValuationSchema>;
export type Valuation = typeof valuations.$inferSelect;
