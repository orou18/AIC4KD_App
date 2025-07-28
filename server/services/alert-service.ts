import { storage } from "../storage";
import { type Consultation, type InsertAlert } from "@shared/schema";

export async function generateAlerts(consultation: Consultation): Promise<void> {
  const alertConfig = await storage.getAlertConfiguration(consultation.patientId);
  const alerts: InsertAlert[] = [];

  // Check creatinine levels
  if (consultation.creatinine) {
    const creatinineValue = parseFloat(consultation.creatinine);
    const criticalThreshold = alertConfig?.creatinineCritical ? parseFloat(alertConfig.creatinineCritical) : 3.0;
    const warningThreshold = alertConfig?.creatinineWarning ? parseFloat(alertConfig.creatinineWarning) : 2.0;

    if (creatinineValue >= criticalThreshold) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'critical',
        status: 'active',
        message: `Critical creatinine level: ${creatinineValue} mg/dL (Normal: 0.6-1.2 mg/dL)`,
        parameter: 'creatinine',
        value: consultation.creatinine,
        threshold: criticalThreshold.toString(),
      });
    } else if (creatinineValue >= warningThreshold) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'warning',
        status: 'active',
        message: `Elevated creatinine level: ${creatinineValue} mg/dL (Normal: 0.6-1.2 mg/dL)`,
        parameter: 'creatinine',
        value: consultation.creatinine,
        threshold: warningThreshold.toString(),
      });
    }
  }

  // Check blood pressure
  if (consultation.systolic && consultation.diastolic) {
    const systolicCritical = alertConfig?.systolicCritical || 180;
    const systolicWarning = alertConfig?.systolicWarning || 140;
    const diastolicCritical = alertConfig?.diastolicCritical || 110;
    const diastolicWarning = alertConfig?.diastolicWarning || 90;

    if (consultation.systolic >= systolicCritical || consultation.diastolic >= diastolicCritical) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'critical',
        status: 'active',
        message: `Critical blood pressure: ${consultation.systolic}/${consultation.diastolic} mmHg (Severe Hypertension)`,
        parameter: 'blood_pressure',
        value: `${consultation.systolic}/${consultation.diastolic}`,
        threshold: `${systolicCritical}/${diastolicCritical}`,
      });
    } else if (consultation.systolic >= systolicWarning || consultation.diastolic >= diastolicWarning) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'warning',
        status: 'active',
        message: `Elevated blood pressure: ${consultation.systolic}/${consultation.diastolic} mmHg (Hypertension)`,
        parameter: 'blood_pressure',
        value: `${consultation.systolic}/${consultation.diastolic}`,
        threshold: `${systolicWarning}/${diastolicWarning}`,
      });
    }
  }

  // Check for rapid weight loss
  if (consultation.weight) {
    const recentConsultations = await storage.getConsultationsByPatient(consultation.patientId);
    if (recentConsultations.length > 1) {
      const previousWeight = recentConsultations.find(c => c.id !== consultation.id && c.weight)?.weight;
      if (previousWeight) {
        const weightLoss = parseFloat(previousWeight) - parseFloat(consultation.weight);
        const weightLossThreshold = alertConfig?.weightLossThreshold ? parseFloat(alertConfig.weightLossThreshold) : 2.0;
        
        // Assuming consultations are within a week for this calculation
        if (weightLoss >= weightLossThreshold) {
          alerts.push({
            patientId: consultation.patientId,
            consultationId: consultation.id,
            severity: 'warning',
            status: 'active',
            message: `Rapid weight loss detected: ${weightLoss.toFixed(1)}kg lost`,
            parameter: 'weight',
            value: consultation.weight,
            threshold: weightLossThreshold.toString(),
          });
        }
      }
    }
  }

  // Check eGFR levels for CKD progression
  if (consultation.egfr) {
    if (consultation.egfr < 15) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'critical',
        status: 'active',
        message: `Severe CKD progression: eGFR ${consultation.egfr} mL/min/1.73m² (Stage 5 CKD)`,
        parameter: 'egfr',
        value: consultation.egfr.toString(),
        threshold: '15',
      });
    } else if (consultation.egfr < 30) {
      alerts.push({
        patientId: consultation.patientId,
        consultationId: consultation.id,
        severity: 'warning',
        status: 'active',
        message: `CKD progression: eGFR ${consultation.egfr} mL/min/1.73m² (Stage 4 CKD)`,
        parameter: 'egfr',
        value: consultation.egfr.toString(),
        threshold: '30',
      });
    }
  }

  // Create all generated alerts
  for (const alert of alerts) {
    await storage.createAlert(alert);
  }
}
