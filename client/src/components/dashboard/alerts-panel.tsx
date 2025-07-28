import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, Eye } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export function AlertsPanel() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time alerts
  });

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

  const sortedAlerts = alerts?.sort((a, b) => {
    // Sort by severity (critical first) then by creation date
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) || [];

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Critical Alerts</CardTitle>
            <Button variant="ghost" size="sm" className="text-medical-blue hover:text-medical-light">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedAlerts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'critical' ? 'bg-critical' : 'bg-warning'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.patient.fullName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                        className={
                          alert.severity === 'critical'
                            ? 'bg-critical text-white'
                            : 'bg-warning text-white'
                        }
                      >
                        {alert.severity === 'critical' ? (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                      </Badge>
                      <Link href={`/patients/${alert.patient.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-medical-blue hover:text-medical-light text-xs h-auto p-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Patient
                        </Button>
                      </Link>
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
