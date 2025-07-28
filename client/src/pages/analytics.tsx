import { useQuery } from "@tanstack/react-query";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Activity, Users, AlertTriangle, Calendar } from "lucide-react";
import { useState } from "react";
import * as React from "react";

interface DashboardStats {
  totalPatients: number;
  activeAlerts: number;
  todayConsultations: number;
  reportsGenerated: number;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>("month");

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const timeRanges = [
    { value: "week", label: "7 derniers jours" },
    { value: "month", label: "30 derniers jours" },
    { value: "quarter", label: "3 derniers mois" },
    { value: "year", label: "12 derniers mois" },
  ];

  // Calculs de tendances simulés (normalement basés sur des données historiques)
  const trends = {
    patients: { value: 15, direction: "up" },
    alerts: { value: -23, direction: "down" },
    consultations: { value: 8, direction: "up" },
    reports: { value: 12, direction: "up" },
  };

  const alertsBySeverity = Array.isArray(alerts) ? {
    critical: alerts.filter((a: any) => a.severity === 'critical' && a.status === 'active').length,
    warning: alerts.filter((a: any) => a.severity === 'warning' && a.status === 'active').length,
    info: alerts.filter((a: any) => a.severity === 'info' && a.status === 'active').length,
  } : { critical: 0, warning: 0, info: 0 };

  const ckdStageDistribution = [
    { stage: "Stade 1", count: 2, percentage: 25 },
    { stage: "Stade 2", count: 3, percentage: 37.5 },
    { stage: "Stade 3a", count: 2, percentage: 25 },
    { stage: "Stade 3b", count: 1, percentage: 12.5 },
    { stage: "Stade 4", count: 0, percentage: 0 },
    { stage: "Stade 5", count: 0, percentage: 0 },
  ];

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (direction: string) => {
    return direction === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <FrenchSidebar />
      <div className="flex-1 flex flex-col">
        <FrenchHeader />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytiques et Tendances</h1>
              <p className="text-gray-600">
                Visualisez les métriques clés et les tendances de votre pratique
              </p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics with Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Patients</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats?.totalPatients || 0}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center ${getTrendColor(trends.patients.direction)}`}>
                      {React.createElement(getTrendIcon(trends.patients.direction), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{Math.abs(trends.patients.value)}%</span>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Alertes Actives</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats?.activeAlerts || 0}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center ${getTrendColor(trends.alerts.direction)}`}>
                      {React.createElement(getTrendIcon(trends.alerts.direction), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{Math.abs(trends.alerts.value)}%</span>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Consultations</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats?.todayConsultations || 0}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center ${getTrendColor(trends.consultations.direction)}`}>
                      {React.createElement(getTrendIcon(trends.consultations.direction), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{Math.abs(trends.consultations.value)}%</span>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rapports Générés</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats?.reportsGenerated || 0}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center ${getTrendColor(trends.reports.direction)}`}>
                      {React.createElement(getTrendIcon(trends.reports.direction), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{Math.abs(trends.reports.value)}%</span>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Alerts by Severity */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Alertes par Sévérité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Critiques</span>
                    </div>
                    <span className="font-semibold">{alertsBySeverity.critical}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Attention</span>
                    </div>
                    <span className="font-semibold">{alertsBySeverity.warning}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Information</span>
                    </div>
                    <span className="font-semibold">{alertsBySeverity.info}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CKD Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution par Stade IRC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ckdStageDistribution.map((stage) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{stage.stage}</span>
                        <span className="font-semibold">{stage.count} patients</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                  <div className="text-sm text-gray-600">Taux de résolution des alertes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1.2</div>
                  <div className="text-sm text-gray-600">Consultations moyennes par patient/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">18min</div>
                  <div className="text-sm text-gray-600">Temps moyen de consultation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}