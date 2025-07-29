import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { FrenchStatsCards } from "@/components/dashboard/french-stats-cards";
import { FrenchAlertsPanel } from "@/components/dashboard/french-alerts-panel";
import { FrenchPatientsPanel } from "@/components/dashboard/french-patients-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <FrenchSidebar />
      <div className="flex-1 flex flex-col">
        <FrenchHeader />
        <main className="flex-1 p-6">
          <FrenchStatsCards />
          {/* Search Bar */}
          <Card className="mb-6 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un patient, consultation ou alerte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FrenchAlertsPanel searchTerm={searchTerm} />
            </div>
            <div className="lg:col-span-1">
              <FrenchPatientsPanel searchTerm={searchTerm} />
            </div>
          </div>
        </main>
      </div>
      {/* Floating Action Button */}
      <Link href="/patients/new">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-green-400 hover:from-blue-700 hover:to-green-500 text-white shadow-xl border-4 border-white"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
