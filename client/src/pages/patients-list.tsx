import { useQuery } from "@tanstack/react-query";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, FileText, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Patient {
  id: string;
  fullName: string;
  age: number;
  patientId: string;
  ckdStage: string;
  medicalHistory: string;
  createdAt: string;
}

interface Alert {
  id: string;
  patientId: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
}

export default function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const getPatientAlertStatus = (patientId: string) => {
    const patientAlerts = (alerts || []).filter(alert => 
      alert.patientId === patientId && alert.status === 'active'
    );
    const criticalCount = patientAlerts.filter(alert => alert.severity === 'critical').length;
    const warningCount = patientAlerts.filter(alert => alert.severity === 'warning').length;
    
    if (criticalCount > 0) return { status: 'Critique', color: 'bg-red-500', count: criticalCount };
    if (warningCount > 0) return { status: 'Attention', color: 'bg-yellow-500', count: warningCount };
    return { status: 'Stable', color: 'bg-green-500', count: 0 };
  };

  const filteredPatients = (patients || []).filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ckdStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/generate-pdf`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-patient-${patientId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
              <p className="text-gray-600">
                {patients?.length || 0} patient(s) total
              </p>
            </div>
            <Link href="/patients/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Patient
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, ID patient ou stade IRC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patients List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4 p-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun patient trouvé</p>
                  {searchTerm && (
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPatients.map((patient) => {
                    const alertStatus = getPatientAlertStatus(patient.id);
                    const initials = patient.fullName
                      .split(' ')
                      .map(name => name[0])
                      .join('')
                      .toUpperCase();

                    return (
                      <div
                        key={patient.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {patient.fullName}
                            </h3>
                            {alertStatus.count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {alertStatus.count} alerte(s)
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {patient.patientId}</span>
                            <span>{patient.age} ans</span>
                            <span>{patient.ckdStage}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-white ${alertStatus.color}`}
                          >
                            {alertStatus.status}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            <Link href={`/patients/${patient.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => generatePDF(patient.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}