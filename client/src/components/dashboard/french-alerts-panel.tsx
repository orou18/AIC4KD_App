import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, Eye } from "lucide-react";
import { Link } from "wouter";

interface Alert {
  id: string;
  patientId: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  message: string;
  parameter: string;
  value: string;
  threshold: string;
  createdAt: string;
  patient?: {
    id: string;
    fullName: string;
  };
}

interface FrenchAlertsPanelProps {
  searchTerm?: string;
}

export function FrenchAlertsPanel({ searchTerm = "" }: FrenchAlertsPanelProps) {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  // Filter alerts based on search term
  const filteredAlerts = (alerts || []).filter(alert =>
    alert.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedAlerts = (filteredAlerts || []).sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Critique';
      case 'warning':
        return 'Attention';
      default:
        return 'Info';
    }
  };

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Alertes Critiques</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              Voir Tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedAlerts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune alerte active</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start space-x-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {alert.patient?.fullName || 'Patient inconnu'}
                        </p>
                        <span className="text-xs text-gray-500">
                          il y a {Math.floor((Date.now() - new Date(alert.createdAt).getTime()) / (1000 * 60))} min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                            {getSeverityText(alert.severity)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {alert.parameter}: {alert.value}
                          </span>
                        </div>
                        <Link href={`/patients/${alert.patientId}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}