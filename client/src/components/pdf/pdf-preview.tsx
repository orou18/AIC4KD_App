import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { type PatientWithDetails } from "@shared/schema";

interface PDFPreviewProps {
  patient: PatientWithDetails;
}

export function PDFPreview({ patient }: PDFPreviewProps) {
  const generatePDF = async () => {
    try {
      const response = await fetch(`/api/patients/${patient.id}/generate-pdf`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient-report-${patient.patientId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const latestConsultation = patient.consultations?.[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>PDF Report Preview</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={generatePDF}
              className="bg-medical-blue hover:bg-medical-light"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* PDF Content Preview */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-4xl mx-auto font-serif">
          {/* PDF Header */}
          <div className="text-center border-b-2 border-medical-blue pb-4 mb-6">
            <h1 className="text-2xl font-bold text-medical-blue">AI4CKD Medical Report</h1>
            <p className="text-sm text-gray-600 mt-2">Chronic Kidney Disease Management Platform</p>
          </div>
          
          {/* Patient Information Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Name:</strong> {patient.fullName}</p>
                <p><strong>Patient ID:</strong> {patient.patientId}</p>
                <p><strong>Age:</strong> {patient.age} years</p>
              </div>
              <div>
                <p><strong>CKD Stage:</strong> {patient.ckdStage}</p>
                <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Physician:</strong> Dr. Sarah Wilson</p>
              </div>
            </div>
          </div>
          
          {/* Medical History Section */}
          {patient.medicalHistory && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                Medical History
              </h2>
              <p className="text-sm text-gray-700">{patient.medicalHistory}</p>
            </div>
          )}
          
          {/* Clinical Data Section */}
          {latestConsultation && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                Recent Clinical Data
              </h2>
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left">Parameter</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Value</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Normal Range</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestConsultation.creatinine && (
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Creatinine</td>
                      <td className="border border-gray-300 px-3 py-2 font-medium text-critical">
                        {latestConsultation.creatinine} mg/dL
                      </td>
                      <td className="border border-gray-300 px-3 py-2">0.6-1.2 mg/dL</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <Badge variant="destructive" className="text-xs">
                          {parseFloat(latestConsultation.creatinine) > 3.0 ? 'Critical' : 
                           parseFloat(latestConsultation.creatinine) > 2.0 ? 'Elevated' : 'Normal'}
                        </Badge>
                      </td>
                    </tr>
                  )}
                  {latestConsultation.egfr && (
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">eGFR</td>
                      <td className="border border-gray-300 px-3 py-2 font-medium text-warning">
                        {latestConsultation.egfr} mL/min/1.73m²
                      </td>
                      <td className="border border-gray-300 px-3 py-2">&gt;60 mL/min/1.73m²</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <Badge 
                          variant={latestConsultation.egfr < 30 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {latestConsultation.egfr < 30 ? 'Low' : 'Reduced'}
                        </Badge>
                      </td>
                    </tr>
                  )}
                  {latestConsultation.systolic && latestConsultation.diastolic && (
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Blood Pressure</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {latestConsultation.systolic}/{latestConsultation.diastolic} mmHg
                      </td>
                      <td className="border border-gray-300 px-3 py-2">&lt;120/80 mmHg</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <Badge 
                          variant={
                            (latestConsultation.systolic >= 180 || latestConsultation.diastolic >= 110) 
                              ? "destructive" 
                              : (latestConsultation.systolic >= 140 || latestConsultation.diastolic >= 90)
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {(latestConsultation.systolic >= 180 || latestConsultation.diastolic >= 110) 
                            ? 'Critical' 
                            : (latestConsultation.systolic >= 140 || latestConsultation.diastolic >= 90)
                            ? 'Elevated'
                            : 'Normal'}
                        </Badge>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Active Alerts Section */}
          {patient.alerts && patient.alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                Active Alerts
              </h2>
              <div className="space-y-2">
                {patient.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center space-x-2 p-2 rounded border ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-critical' : 'bg-warning'
                      }`}
                    />
                    <span className="text-sm text-gray-700">{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Clinical Notes Section */}
          {latestConsultation?.clinicalNotes && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                Clinical Notes
              </h2>
              <p className="text-sm text-gray-700">{latestConsultation.clinicalNotes}</p>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
            <p>Generated by AI4CKD Platform | {new Date().toLocaleString()}</p>
            <p>This report is confidential and intended for medical professionals only.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
