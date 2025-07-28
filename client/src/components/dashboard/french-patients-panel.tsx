import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, User } from "lucide-react";
import { Link } from "wouter";

interface Patient {
  id: string;
  fullName: string;
  age: number;
  ckdStage: string;
}

interface Consultation {
  id: string;
  patientId: string;
  consultationDate: string;
  patient: Patient;
}

interface Alert {
  id: string;
  patientId: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
}

interface FrenchPatientsPanelProps {
  searchTerm?: string;
}

export function FrenchPatientsPanel({ searchTerm = "" }: FrenchPatientsPanelProps) {
  const { data: consultations, isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations/recent"],
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  // Filter consultations based on search term
  const filteredConsultations = (consultations || []).filter(consultation =>
    consultation.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.patient?.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPatientAlertStatus = (patientId: string) => {
    const patientAlerts = (alerts || []).filter(alert => 
      alert.patientId === patientId && alert.status === 'active'
    );
    const hasCritical = patientAlerts.some(alert => alert.severity === 'critical');
    const hasWarning = patientAlerts.some(alert => alert.severity === 'warning');
    
    if (hasCritical) return { status: 'Critique', color: 'bg-red-500' };
    if (hasWarning) return { status: 'Attention', color: 'bg-yellow-500' };
    return { status: 'Stable', color: 'bg-green-500' };
  };

  const generatePDF = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/generate-pdf`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-patient-${patientId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Patients Récents</CardTitle>
      </CardHeader>
      <CardContent>
        {!consultations || consultations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune consultation récente</p>
          </div>
        ) : filteredConsultations.length === 0 && searchTerm ? (
          <div className="text-center py-6 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun patient trouvé</p>
            <p className="text-sm">Essayez de modifier votre recherche</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.slice(0, 6).map((consultation) => {
              const alertStatus = getPatientAlertStatus(consultation.patient.id);
              const initials = consultation.patient.fullName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();

              return (
                <div key={consultation.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link href={`/patients/${consultation.patient.id}`}>
                      <p className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer truncate">
                        {consultation.patient.fullName}
                      </p>
                    </Link>
                    <p className="text-xs text-gray-500">
                      {consultation.patient.age} ans • {consultation.patient.ckdStage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs text-white ${alertStatus.color}`}
                    >
                      {alertStatus.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                      onClick={() => generatePDF(consultation.patient.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}