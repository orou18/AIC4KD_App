import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Settings,
  Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";

export function FrenchSidebar() {
  const [location] = useLocation();

  const menuItems = [
    {
      title: "Tableau de Bord",
      icon: Home,
      href: "/",
      active: location === "/",
    },
    {
      title: "Patients",
      icon: Users,
      href: "/patients",
      active: location.startsWith("/patients"),
    },
    {
      title: "Consultations",
      icon: Calendar,
      href: "/consultations",
      active: location.startsWith("/consultations"),
    },
    {
      title: "Alertes",
      icon: AlertTriangle,
      href: "/alerts",
      active: location.startsWith("/alerts"),
    },
    {
      title: "Rapports",
      icon: FileText,
      href: "/reports",
      active: location.startsWith("/reports"),
    },
    {
      title: "Analytiques",
      icon: Activity,
      href: "/analytics",
      active: location.startsWith("/analytics"),
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/settings",
      active: location.startsWith("/settings"),
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI4CKD</h1>
            <p className="text-xs text-gray-500">Gestion IRC</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.active
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2025 AI4CKD</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}