import { useQuery } from "@tanstack/react-query";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Calendar, User, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Patient {
  id: string;
  fullName: string;
  patientId: string;
  ckdStage: string;
  age: number;
  createdAt: string;
}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("month");

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
    refetchInterval: 30000,
  });

  const filteredPatients = (patients || []).filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ckdStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePatientReport = async (patientId: string, patientName: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/generate-pdf`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${patientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  const generateBulkReport = async () => {
    // Cette fonctionnalité pourrait générer un rapport consolidé pour tous les patients
    console.log("Génération du rapport global...");
  };

  const reportTypes = [
    { value: "all", label: "Tous les rapports" },
    { value: "individual", label: "Rapports individuels" },
    { value: "summary", label: "Rapports de synthèse" },
    { value: "alerts", label: "Rapports d'alertes" },
    { value: "statistics", label: "Rapports statistiques" },
  ];

  const dateRanges = [
    { value: "week", label: "7 derniers jours" },
    { value: "month", label: "30 derniers jours" },
    { value: "quarter", label: "3 derniers mois" },
    { value: "year", label: "12 derniers mois" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
              <h1 className="text-2xl font-bold text-gray-900">Génération de Rapports</h1>
              <p className="text-gray-600">
                Créez et téléchargez des rapports médicaux personnalisés
              </p>
            </div>
            <Button onClick={generateBulkReport} className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapport Global
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de rapport" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={generateBulkReport}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Rapport Statistique Global</h3>
                <p className="text-sm text-gray-600">Vue d'ensemble des statistiques de tous les patients</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Rapport d'Alertes</h3>
                <p className="text-sm text-gray-600">Synthèse des alertes critiques et tendances</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Rapport de Consultations</h3>
                <p className="text-sm text-gray-600">Résumé des consultations par période</p>
              </CardContent>
            </Card>
          </div>

          {/* Individual Patient Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Rapports Individuels des Patients</CardTitle>
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
                        <div className="w-24 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun patient trouvé</p>
                  {searchTerm && (
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Link href={`/patients/${patient.id}`}>
                            <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                              {patient.fullName}
                            </h3>
                          </Link>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>ID: {patient.patientId}</span>
                            <span>•</span>
                            <span>{patient.age} ans</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {patient.ckdStage}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          Créé le {formatDate(patient.createdAt)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generatePatientReport(patient.id, patient.fullName)}
                          className="flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>PDF</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}