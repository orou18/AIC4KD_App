import { type Consultation, type AlertConfiguration } from "@shared/schema";

export interface AlertResult {
  level: 'critical' | 'warning' | 'info';
  message: string;
  parameter: string;
  value: string;
  threshold: string;
}

export function checkConsultationAlerts(
  consultation: Partial<Consultation>,
  alertConfig?: AlertConfiguration
): AlertResult[] {
  const alerts: AlertResult[] = [];

  // Check creatinine levels
  if (consultation.creatinine) {
    const creatinineValue = parseFloat(consultation.creatinine);
    const criticalThreshold = alertConfig?.creatinineCritical ? parseFloat(alertConfig.creatinineCritical) : 3.0;
    const warningThreshold = alertConfig?.creatinineWarning ? parseFloat(alertConfig.creatinineWarning) : 2.0;

    if (creatinineValue >= criticalThreshold) {
      alerts.push({
        level: 'critical',
        message: `Critical creatinine level: ${creatinineValue} mg/dL (Normal: 0.6-1.2)`,
        parameter: 'creatinine',
        value: consultation.creatinine,
        threshold: criticalThreshold.toString(),
      });
    } else if (creatinineValue >= warningThreshold) {
      alerts.push({
        level: 'warning',
        message: `Elevated creatinine level: ${creatinineValue} mg/dL (Normal: 0.6-1.2)`,
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
        level: 'critical',
        message: `Critical blood pressure: ${consultation.systolic}/${consultation.diastolic} mmHg (Severe Hypertension)`,
        parameter: 'blood_pressure',
        value: `${consultation.systolic}/${consultation.diastolic}`,
        threshold: `${systolicCritical}/${diastolicCritical}`,
      });
    } else if (consultation.systolic >= systolicWarning || consultation.diastolic >= diastolicWarning) {
      alerts.push({
        level: 'warning',
        message: `Elevated blood pressure: ${consultation.systolic}/${consultation.diastolic} mmHg (Hypertension)`,
        parameter: 'blood_pressure',
        value: `${consultation.systolic}/${consultation.diastolic}`,
        threshold: `${systolicWarning}/${diastolicWarning}`,
      });
    }
  }

  // Check eGFR levels for CKD progression
  if (consultation.egfr) {
    if (consultation.egfr < 15) {
      alerts.push({
        level: 'critical',
        message: `Severe CKD progression: eGFR ${consultation.egfr} mL/min/1.73m² (Stage 5 CKD)`,
        parameter: 'egfr',
        value: consultation.egfr.toString(),
        threshold: '15',
      });
    } else if (consultation.egfr < 30) {
      alerts.push({
        level: 'warning',
        message: `CKD progression: eGFR ${consultation.egfr} mL/min/1.73m² (Stage 4 CKD)`,
        parameter: 'egfr',
        value: consultation.egfr.toString(),
        threshold: '30',
      });
    }
  }

  return alerts;
}

export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-critical';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

export function getAlertSeverityBgColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
