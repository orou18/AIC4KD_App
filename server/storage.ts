import {
  patients,
  consultations,
  alerts,
  alertConfigurations,
  type Patient,
  type InsertPatient,
  type Consultation,
  type InsertConsultation,
  type Alert,
  type InsertAlert,
  type AlertConfiguration,
  type InsertAlertConfiguration,
  type PatientWithDetails,
  type ConsultationWithPatient,
  type AlertWithPatient,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // Patient operations
  getPatients(): Promise<Patient[]>;
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientWithDetails(id: string): Promise<PatientWithDetails | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;

  // Consultation operations
  getConsultationsByPatient(patientId: string): Promise<Consultation[]>;
  getConsultation(id: string): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getRecentConsultations(limit?: number): Promise<ConsultationWithPatient[]>;

  // Alert operations
  getActiveAlerts(): Promise<AlertWithPatient[]>;
  getAlertsByPatient(patientId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: string): Promise<Alert>;
  acknowledgeAlert(id: string): Promise<Alert>;

  // Alert configuration operations
  getAlertConfiguration(patientId: string): Promise<AlertConfiguration | undefined>;
  createOrUpdateAlertConfiguration(config: InsertAlertConfiguration): Promise<AlertConfiguration>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalPatients: number;
    activeAlerts: number;
    todayConsultations: number;
    reportsGenerated: number;
  }>;

  deletePatient(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.updatedAt));
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientWithDetails(id: string): Promise<PatientWithDetails | undefined> {
    const patient = await db.query.patients.findFirst({
      where: eq(patients.id, id),
      with: {
        consultations: {
          orderBy: desc(consultations.consultationDate),
        },
        alerts: {
          where: eq(alerts.status, 'active'),
          orderBy: desc(alerts.createdAt),
        },
        alertConfiguration: true,
      },
    });
    return patient as PatientWithDetails | undefined;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db
      .insert(patients)
      .values({
        ...patient,
        patientId: patient.patientId || `CKD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      })
      .returning();

    // Create default alert configuration
    await this.createOrUpdateAlertConfiguration({
      patientId: newPatient.id,
    });

    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async deletePatient(id: string): Promise<void> {
    // Delete related consultations first
    await db.delete(consultations).where(eq(consultations.patientId, id));

    // Delete related alerts
    await db.delete(alerts).where(eq(alerts.patientId, id));

    // Delete alert configurations
    await db.delete(alertConfigurations).where(eq(alertConfigurations.patientId, id));

    // Finally delete the patient
    await db.delete(patients).where(eq(patients.id, id));
  }

  // Consultation operations
  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.patientId, patientId))
      .orderBy(desc(consultations.consultationDate));
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation || undefined;
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(consultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  async getRecentConsultations(limit: number = 10): Promise<ConsultationWithPatient[]> {
    const results = await db
      .select()
      .from(consultations)
      .innerJoin(patients, eq(consultations.patientId, patients.id))
      .orderBy(desc(consultations.consultationDate))
      .limit(limit);

    return results.map(result => ({
      ...result.consultations,
      patient: result.patients,
    }));
  }

  // Alert operations
  async getActiveAlerts(): Promise<AlertWithPatient[]> {
    const results = await db
      .select()
      .from(alerts)
      .innerJoin(patients, eq(alerts.patientId, patients.id))
      .leftJoin(consultations, eq(alerts.consultationId, consultations.id))
      .where(eq(alerts.status, 'active'))
      .orderBy(desc(alerts.createdAt));

    return results.map(result => ({
      ...result.alerts,
      patient: result.patients,
      consultation: result.consultations || undefined,
    }));
  }

  async getAlertsByPatient(patientId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.patientId, patientId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async resolveAlert(id: string): Promise<Alert> {
    const [resolvedAlert] = await db
      .update(alerts)
      .set({ status: 'resolved', resolvedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return resolvedAlert;
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    const [acknowledgedAlert] = await db
      .update(alerts)
      .set({ status: 'acknowledged' })
      .where(eq(alerts.id, id))
      .returning();
    return acknowledgedAlert;
  }

  // Alert configuration operations
  async getAlertConfiguration(patientId: string): Promise<AlertConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(alertConfigurations)
      .where(eq(alertConfigurations.patientId, patientId));
    return config || undefined;
  }

  async createOrUpdateAlertConfiguration(config: InsertAlertConfiguration): Promise<AlertConfiguration> {
    const existing = await this.getAlertConfiguration(config.patientId);

    if (existing) {
      const [updatedConfig] = await db
        .update(alertConfigurations)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(alertConfigurations.patientId, config.patientId))
        .returning();
      return updatedConfig;
    } else {
      const [newConfig] = await db
        .insert(alertConfigurations)
        .values(config)
        .returning();
      return newConfig;
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalPatients: number;
    activeAlerts: number;
    todayConsultations: number;
    reportsGenerated: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatientsResult] = await db
      .select({ count: count() })
      .from(patients);

    const [activeAlertsResult] = await db
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.status, 'active'));

    const [todayConsultationsResult] = await db
      .select({ count: count() })
      .from(consultations)
      .where(
        and(
          sql`${consultations.consultationDate} >= ${today}`,
          sql`${consultations.consultationDate} < ${tomorrow}`
        )
      );

    // For now, reports generated is based on consultation count (each consultation can generate a report)
    const [reportsGeneratedResult] = await db
      .select({ count: count() })
      .from(consultations);

    return {
      totalPatients: totalPatientsResult.count,
      activeAlerts: activeAlertsResult.count,
      todayConsultations: todayConsultationsResult.count,
      reportsGenerated: reportsGeneratedResult.count,
    };
  }
}

export const storage = new DatabaseStorage();