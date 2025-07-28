import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  integer,
  decimal,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const ckdStageEnum = pgEnum('ckd_stage', ['Stage 1', 'Stage 2', 'Stage 3a', 'Stage 3b', 'Stage 4', 'Stage 5']);
export const alertSeverityEnum = pgEnum('alert_severity', ['critical', 'warning', 'info']);
export const alertStatusEnum = pgEnum('alert_status', ['active', 'resolved', 'acknowledged']);

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name").notNull(),
  age: integer("age").notNull(),
  patientId: varchar("patient_id").notNull().unique(),
  ckdStage: ckdStageEnum("ckd_stage").notNull(),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  creatinine: decimal("creatinine", { precision: 4, scale: 2 }),
  egfr: integer("egfr"),
  systolic: integer("systolic"),
  diastolic: integer("diastolic"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  clinicalNotes: text("clinical_notes"),
  consultationDate: timestamp("consultation_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  consultationId: varchar("consultation_id").references(() => consultations.id),
  severity: alertSeverityEnum("severity").notNull(),
  status: alertStatusEnum("status").notNull().default('active'),
  message: text("message").notNull(),
  parameter: varchar("parameter"), // e.g., 'creatinine', 'blood_pressure', 'weight'
  value: varchar("value"), // the actual value that triggered the alert
  threshold: varchar("threshold"), // the threshold that was exceeded
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Alert configurations table for customizable thresholds
export const alertConfigurations = pgTable("alert_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  creatinineCritical: decimal("creatinine_critical", { precision: 4, scale: 2 }).default('3.0'),
  creatinineWarning: decimal("creatinine_warning", { precision: 4, scale: 2 }).default('2.0'),
  systolicCritical: integer("systolic_critical").default(180),
  systolicWarning: integer("systolic_warning").default(140),
  diastolicCritical: integer("diastolic_critical").default(110),
  diastolicWarning: integer("diastolic_warning").default(90),
  weightLossThreshold: decimal("weight_loss_threshold", { precision: 4, scale: 2 }).default('2.0'), // kg per week
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const patientsRelations = relations(patients, ({ many }) => ({
  consultations: many(consultations),
  alerts: many(alerts),
  alertConfiguration: many(alertConfigurations),
}));

export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  patient: one(patients, {
    fields: [consultations.patientId],
    references: [patients.id],
  }),
  alerts: many(alerts),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  patient: one(patients, {
    fields: [alerts.patientId],
    references: [patients.id],
  }),
  consultation: one(consultations, {
    fields: [alerts.consultationId],
    references: [consultations.id],
  }),
}));

export const alertConfigurationsRelations = relations(alertConfigurations, ({ one }) => ({
  patient: one(patients, {
    fields: [alertConfigurations.patientId],
    references: [patients.id],
  }),
}));

// Insert schemas
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertAlertConfigurationSchema = createInsertSchema(alertConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type AlertConfiguration = typeof alertConfigurations.$inferSelect;
export type InsertAlertConfiguration = z.infer<typeof insertAlertConfigurationSchema>;

// Extended types with relations
export type PatientWithDetails = Patient & {
  consultations: Consultation[];
  alerts: Alert[];
  alertConfiguration: AlertConfiguration[];
};

export type ConsultationWithPatient = Consultation & {
  patient: Patient;
};

export type AlertWithPatient = Alert & {
  patient: Patient;
  consultation?: Consultation;
};
