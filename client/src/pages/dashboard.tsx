import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { RecentPatientsPanel } from "@/components/dashboard/recent-patients-panel";

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
    </div>
  );
}
