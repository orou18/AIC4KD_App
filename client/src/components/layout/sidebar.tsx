import { Link, useRoute } from "wouter";
import { 
  HeartPulse, 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  FileText, 
  Settings 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const [isOnDashboard] = useRoute("/");
  const [isOnPatients] = useRoute("/patients/:id");

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/",
      active: isOnDashboard,
    },
    {
      icon: Users,
      label: "Patients",
      href: "/patients",
      active: isOnPatients,
    },
    {
      icon: CalendarCheck,
      label: "Consultations",
      href: "/consultations",
      active: false,
    },
    {
      icon: AlertTriangle,
      label: "Alerts",
      href: "/alerts",
      active: false,
      badge: stats?.activeAlerts,
    },
    {
      icon: FileText,
      label: "Reports",
      href: "/reports",
      active: false,
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      active: false,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
            <HeartPulse className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI4CKD</h1>
            <p className="text-sm text-gray-500">Medical Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center px-3 py-2 rounded-lg mb-1 transition-colors cursor-pointer
                ${item.active 
                  ? 'text-medical-blue bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:text-medical-blue hover:bg-gray-50'
                }
              `}>
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
