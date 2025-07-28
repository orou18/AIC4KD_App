import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema, insertAlertConfigurationSchema } from "@shared/schema";
import { generateAlerts } from "./services/alert-service";
import { generatePatientPDF } from "./services/pdf-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatientWithDetails(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const patientData = req.body;
      const patient = await storage.updatePatient(req.params.id, patientData);
      res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Failed to update patient" });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      await storage.deletePatient(req.params.id);
      res.json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Failed to delete patient" });
    }
  });

  // Consultation routes
  app.get("/api/consultations/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const consultations = await storage.getRecentConsultations(limit);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching recent consultations:", error);
      res.status(500).json({ message: "Failed to fetch recent consultations" });
    }
  });

  app.get("/api/patients/:patientId/consultations", async (req, res) => {
    try {
      const consultations = await storage.getConsultationsByPatient(req.params.patientId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching patient consultations:", error);
      res.status(500).json({ message: "Failed to fetch patient consultations" });
    }
  });

  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);

      // Generate alerts based on the new consultation data
      await generateAlerts(consultation);

      res.status(201).json(consultation);
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/patients/:patientId/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlertsByPatient(req.params.patientId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching patient alerts:", error);
      res.status(500).json({ message: "Failed to fetch patient alerts" });
    }
  });

  app.put("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const alert = await storage.resolveAlert(req.params.id);
      res.json(alert);
    } catch (error) {
      console.error("Error resolving alert:", error);
      res.status(500).json({ message: "Failed to resolve alert" });
    }
  });

  app.put("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const alert = await storage.acknowledgeAlert(req.params.id);
      res.json(alert);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Alert configuration routes
  app.get("/api/patients/:patientId/alert-config", async (req, res) => {
    try {
      const config = await storage.getAlertConfiguration(req.params.patientId);
      res.json(config);
    } catch (error) {
      console.error("Error fetching alert configuration:", error);
      res.status(500).json({ message: "Failed to fetch alert configuration" });
    }
  });

  app.post("/api/patients/:patientId/alert-config", async (req, res) => {
    try {
      const validatedData = insertAlertConfigurationSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const config = await storage.createOrUpdateAlertConfiguration(validatedData);
      res.json(config);
    } catch (error) {
      console.error("Error updating alert configuration:", error);
      res.status(400).json({ message: "Invalid alert configuration data" });
    }
  });

  // PDF generation routes
  app.post("/api/patients/:patientId/generate-pdf", async (req, res) => {
    try {
      const patient = await storage.getPatientWithDetails(req.params.patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const pdfBuffer = await generatePatientPDF(patient);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="patient-report-${patient.patientId}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}