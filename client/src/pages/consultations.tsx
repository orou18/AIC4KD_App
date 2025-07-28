import { useQuery } from "@tanstack/react-query";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, User, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Consultation {
  id: string;
  patientId: string;
  consultationDate: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  notes: string;
  patient: {
    id: string;
    fullName: string;
    patientId: string;
    ckdStage: string;
  };
}

export default function Consultations() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: consultations, isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations/recent"],
    refetchInterval: 30000,
  });

  const filteredConsultations = (consultations || []).filter(consultation =>
    consultation.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVitalSignsStatus = (consultation: Consultation) => {
    const isHighBP = consultation.bloodPressureSys > 140 || consultation.bloodPressureDia > 90;
    const isHighHR = consultation.heartRate > 100;
    const isFever = consultation.temperature > 37.5;
    
    if (isHighBP || isHighHR || isFever) return { status: 'Attention', color: 'bg-red-500' };
    return { status: 'Normal', color: 'bg-green-500' };
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
              <h1 className="text-2xl font-bold text-gray-900">Consultations Médicales</h1>
              <p className="text-gray-600">
                {consultations?.length || 0} consultation(s) récente(s)
              </p>
            </div>
            <Link href="/new-consultation">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Consultation
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par patient, notes ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Consultations List */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4 p-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConsultations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune consultation trouvée</p>
                  {searchTerm && (
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConsultations.map((consultation) => {
                    const vitalStatus = getVitalSignsStatus(consultation);
                    
                    return (
                      <div
                        key={consultation.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Link href={`/patients/${consultation.patient.id}`}>
                                  <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                    {consultation.patient.fullName}
                                  </h3>
                                </Link>
                                <Badge variant="outline" className="text-xs">
                                  {consultation.patient.patientId}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {consultation.patient.ckdStage}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                                <div>
                                  <span className="text-gray-500">TA:</span>
                                  <span className="ml-1 font-medium">
                                    {consultation.bloodPressureSys}/{consultation.bloodPressureDia}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">FC:</span>
                                  <span className="ml-1 font-medium">{consultation.heartRate} bpm</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Poids:</span>
                                  <span className="ml-1 font-medium">{consultation.weight} kg</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Temp:</span>
                                  <span className="ml-1 font-medium">{consultation.temperature}°C</span>
                                </div>
                              </div>
                              
                              {consultation.notes && (
                                <p className="text-sm text-gray-600 mb-2">{consultation.notes}</p>
                              )}
                              
                              <p className="text-xs text-gray-500">
                                {formatDate(consultation.consultationDate)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-white ${vitalStatus.color}`}
                            >
                              {vitalStatus.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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