import { type PatientWithDetails } from "@shared/schema";

export async function generatePatientPDF(patient: PatientWithDetails): Promise<void> {
  try {
    const response = await fetch(`/api/patients/${patient.id}/generate-pdf`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-report-${patient.patientId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export function formatDateForPDF(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTimeForPDF(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getParameterNormalRange(parameter: string): string {
  switch (parameter) {
    case 'creatinine':
      return '0.6-1.2 mg/dL';
    case 'egfr':
      return '>60 mL/min/1.73m²';
    case 'blood_pressure':
      return '<120/80 mmHg';
    case 'weight':
      return 'Varies by patient';
    default:
      return 'N/A';
  }
}

export function getParameterStatus(parameter: string, value: string): {
  status: string;
  color: 'normal' | 'warning' | 'critical';
} {
  switch (parameter) {
    case 'creatinine': {
      const numValue = parseFloat(value);
      if (numValue > 3.0) return { status: 'Critical', color: 'critical' };
      if (numValue > 2.0) return { status: 'Elevated', color: 'warning' };
      return { status: 'Normal', color: 'normal' };
    }
    case 'egfr': {
      const numValue = parseInt(value);
      if (numValue < 15) return { status: 'Critical', color: 'critical' };
      if (numValue < 30) return { status: 'Low', color: 'warning' };
      if (numValue < 60) return { status: 'Reduced', color: 'warning' };
      return { status: 'Normal', color: 'normal' };
    }
    case 'blood_pressure': {
      const [systolic, diastolic] = value.split('/').map(Number);
      if (systolic >= 180 || diastolic >= 110) return { status: 'Critical', color: 'critical' };
      if (systolic >= 140 || diastolic >= 90) return { status: 'Elevated', color: 'warning' };
      return { status: 'Normal', color: 'normal' };
    }
    default:
      return { status: 'Unknown', color: 'normal' };
  }
}
