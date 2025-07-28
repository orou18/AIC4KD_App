import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { FrenchStatsCards } from "@/components/dashboard/french-stats-cards";
import { FrenchAlertsPanel } from "@/components/dashboard/french-alerts-panel";
import { FrenchPatientsPanel } from "@/components/dashboard/french-patients-panel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-medical-bg">
      <FrenchSidebar />
      <div className="flex-1 flex flex-col">
        <FrenchHeader />
        <main className="flex-1 p-6">
          <FrenchStatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FrenchAlertsPanel />
            <FrenchPatientsPanel />
          </div>
        </main>
      </div>
      
      {/* Floating Action Button */}
      <Link href="/patients/new">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-medical-blue hover:bg-medical-light shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
