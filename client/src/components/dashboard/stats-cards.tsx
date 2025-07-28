import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertTriangle, CalendarCheck, FileText } from "lucide-react";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const cards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: Users,
      bgColor: "bg-medical-blue bg-opacity-10",
      iconColor: "text-medical-blue",
    },
    {
      title: "Active Alerts",
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      bgColor: "bg-critical bg-opacity-10",
      iconColor: "text-critical",
    },
    {
      title: "Today's Consultations",
      value: stats?.todayConsultations || 0,
      icon: CalendarCheck,
      bgColor: "bg-success bg-opacity-10",
      iconColor: "text-success",
    },
    {
      title: "Reports Generated",
      value: stats?.reportsGenerated || 0,
      icon: FileText,
      bgColor: "bg-warning bg-opacity-10",
      iconColor: "text-warning",
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
      {cards.map((card) => (
        <Card key={card.title} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                <card.icon className={`text-xl ${card.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
