import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { RecentPatientsPanel } from "@/components/dashboard/recent-patients-panel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-medical-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AlertsPanel />
            <RecentPatientsPanel />
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
