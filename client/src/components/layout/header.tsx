import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, AlertTriangle } from "lucide-react";

export function Header() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time alerts
  });

  const criticalAlerts = alerts?.filter(alert => alert.severity === 'critical')?.length || 0;
  const warningAlerts = alerts?.filter(alert => alert.severity === 'warning')?.length || 0;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Chronic Kidney Disease Management</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Alert Summary */}
          <div className="flex items-center space-x-2">
            {criticalAlerts > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{criticalAlerts} Critical</span>
              </Badge>
            )}
            {warningAlerts > 0 && (
              <Badge className="flex items-center space-x-1 bg-warning text-white hover:bg-warning/90">
                <AlertTriangle className="w-3 h-3" />
                <span>{warningAlerts} Warning</span>
              </Badge>
            )}
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Wilson</p>
              <p className="text-xs text-gray-500">Nephrologist</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-medical-blue text-white">SW</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
