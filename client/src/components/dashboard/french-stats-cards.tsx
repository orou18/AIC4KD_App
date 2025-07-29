import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertTriangle, CalendarCheck, FileText } from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  activeAlerts: number;
  todayConsultations: number;
  reportsGenerated: number;
}

export function FrenchStatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const cards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-200 to-blue-400",
      iconColor: "text-white",
    },
    {
      title: "Alertes Actives",
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      bgColor: "bg-gradient-to-br from-red-400 to-pink-500",
      iconColor: "text-white",
    },
    {
      title: "Consultations Aujourd'hui",
      value: stats?.todayConsultations || 0,
      icon: CalendarCheck,
      bgColor: "bg-gradient-to-br from-green-300 to-green-500",
      iconColor: "text-white",
    },
    {
      title: "Rapports Générés",
      value: stats?.reportsGenerated || 0,
      icon: FileText,
      bgColor: "bg-gradient-to-br from-yellow-300 to-yellow-500",
      iconColor: "text-white",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className="shadow-lg bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgColor} shadow-md`}>
                  <IconComponent className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">{card.title}</p>
                  <p className="text-3xl font-bold text-green-600 drop-shadow-sm">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}