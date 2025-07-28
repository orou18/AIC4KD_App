import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, User } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export function RecentPatientsPanel() {
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["/api/consultations/recent"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

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

  // Get patient alert status
  const getPatientAlertStatus = (patientId: string) => {
    const patientAlerts = alerts?.filter(alert => alert.patientId === patientId && alert.status === 'active') || [];
    const hasCritical = patientAlerts.some(alert => alert.severity === 'critical');
    const hasWarning = patientAlerts.some(alert => alert.severity === 'warning');
    
    if (hasCritical) return { status: 'Critical', color: 'bg-critical' };
    if (hasWarning) return { status: 'Warning', color: 'bg-warning' };
    return { status: 'Stable', color: 'bg-success' };
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
        a.download = `patient-report-${patientId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        {!consultations || consultations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent consultations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.slice(0, 6).map((consultation) => {
              const alertStatus = getPatientAlertStatus(consultation.patient.id);
              const initials = consultation.patient.fullName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();

              return (
                <div key={consultation.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {consultation.patient.fullName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Last visit: {formatDistanceToNow(new Date(consultation.consultationDate), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge
                      className={`text-white text-xs ${alertStatus.color}`}
                    >
                      {alertStatus.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Link href={`/patients/${consultation.patient.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-medical-blue hover:text-medical-light text-xs h-auto p-1"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generatePDF(consultation.patient.id)}
                        className="text-medical-blue hover:text-medical-light text-xs h-auto p-1"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
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
