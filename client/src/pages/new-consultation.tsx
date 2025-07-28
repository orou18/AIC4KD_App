
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Calendar, Activity, AlertTriangle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertConsultationSchema } from "@shared/schema";

interface Patient {
  id: string;
  fullName: string;
  patientId: string;
  age: number;
  ckdStage: string;
  medicalHistory?: string;
}

interface Consultation {
  id: string;
  consultationDate: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  notes: string;
}

export default function NewConsultation() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: selectedPatient } = useQuery({
    queryKey: ["/api/patients", selectedPatientId],
    enabled: !!selectedPatientId,
  });

  const { data: alertConfig } = useQuery({
    queryKey: ["/api/patients", selectedPatientId, "alert-config"],
    enabled: !!selectedPatientId,
  });

  const filteredPatients = (patients || []).filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm({
    resolver: zodResolver(insertConsultationSchema),
    defaultValues: {
      patientId: "",
      bloodPressureSys: "",
      bloodPressureDia: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      notes: "",
    },
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/api/consultations`, {
        ...data,
        bloodPressureSys: data.bloodPressureSys ? parseInt(data.bloodPressureSys) : null,
        bloodPressureDia: data.bloodPressureDia ? parseInt(data.bloodPressureDia) : null,
        heartRate: data.heartRate ? parseInt(data.heartRate) : null,
        temperature: data.temperature ? parseFloat(data.temperature) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        height: data.height ? parseFloat(data.height) : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Consultation enregistrée avec succès.",
      });
      form.reset();
      setSelectedPatientId("");
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la consultation",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (!selectedPatientId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un patient",
        variant: "destructive",
      });
      return;
    }
    createConsultationMutation.mutate({
      ...data,
      patientId: selectedPatientId,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Alert checking functions
  const checkBPAlert = (systolic: string, diastolic: string) => {
    if (!systolic || !diastolic || !alertConfig) return null;
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const sysCritical = alertConfig.systolicCritical || 180;
    const diaCritical = alertConfig.diastolicCritical || 110;
    const sysWarning = alertConfig.systolicWarning || 140;
    const diaWarning = alertConfig.diastolicWarning || 90;
    
    if (sys >= sysCritical || dia >= diaCritical) {
      return { level: 'critical', message: `Hypertension sévère (Normal: <120/80)` };
    } else if (sys >= sysWarning || dia >= diaWarning) {
      return { level: 'warning', message: `Hypertension (Normal: <120/80)` };
    }
    return null;
  };

  const bpAlert = checkBPAlert(form.watch('bloodPressureSys'), form.watch('bloodPressureDia'));

  return (
    <div className="min-h-screen flex bg-gray-50">
      <FrenchSidebar />
      <div className="flex-1 flex flex-col">
        <FrenchHeader />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle Consultation</h1>
              <p className="text-gray-600">
                Sélectionnez un patient et enregistrez une nouvelle consultation
              </p>
            </div>
            <Link href="/consultations">
              <Button variant="outline">
                Retour aux consultations
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Sélection du Patient</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un patient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Patient List */}
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {patientsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse p-3 border rounded">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredPatients.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Aucun patient trouvé</p>
                      </div>
                    ) : (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 border rounded cursor-pointer transition-colors ${
                            selectedPatientId === patient.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{patient.fullName}</h4>
                              <p className="text-sm text-gray-500">
                                {patient.patientId} • {patient.age} ans
                              </p>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {patient.ckdStage}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Details */}
              {selectedPatient && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Détails du Patient</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">{selectedPatient.fullName}</h4>
                        <p className="text-sm text-gray-600">
                          ID: {selectedPatient.patientId} • {selectedPatient.age} ans
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {selectedPatient.ckdStage}
                        </Badge>
                      </div>
                      
                      {selectedPatient.medicalHistory && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Antécédents:</h5>
                          <p className="text-sm text-gray-600">{selectedPatient.medicalHistory}</p>
                        </div>
                      )}

                      {/* Recent Consultations */}
                      {selectedPatient.consultations && selectedPatient.consultations.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Consultations récentes:</h5>
                          <div className="space-y-2">
                            {selectedPatient.consultations.slice(0, 3).map((consultation: Consultation) => (
                              <div key={consultation.id} className="text-xs p-2 bg-gray-50 rounded">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{formatDate(consultation.consultationDate)}</p>
                                    <p className="text-gray-600">
                                      TA: {consultation.bloodPressureSys}/{consultation.bloodPressureDia} • 
                                      FC: {consultation.heartRate} • 
                                      Poids: {consultation.weight}kg
                                    </p>
                                  </div>
                                  <Activity className="h-3 w-3 text-gray-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Consultation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nouvelle Consultation</CardTitle>
                  {selectedPatientId ? (
                    <p className="text-sm text-gray-600">
                      Patient sélectionné: {selectedPatient?.fullName}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600">
                      Veuillez d'abord sélectionner un patient
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Vital Signs */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bloodPressureSys"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tension Artérielle</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <div className="flex space-x-2">
                                    <Input
                                      {...field}
                                      type="number"
                                      placeholder="Systolique"
                                      disabled={!selectedPatientId}
                                      className={
                                        bpAlert?.level === 'critical'
                                          ? 'border-red-300 bg-red-50 focus:border-red-500'
                                          : bpAlert?.level === 'warning'
                                          ? 'border-yellow-300 bg-yellow-50 focus:border-yellow-500'
                                          : ''
                                      }
                                    />
                                    <span className="self-center text-gray-500">/</span>
                                    <FormField
                                      control={form.control}
                                      name="bloodPressureDia"
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          type="number"
                                          placeholder="Diastolique"
                                          disabled={!selectedPatientId}
                                          className={
                                            bpAlert?.level === 'critical'
                                              ? 'border-red-300 bg-red-50 focus:border-red-500'
                                              : bpAlert?.level === 'warning'
                                              ? 'border-yellow-300 bg-yellow-50 focus:border-yellow-500'
                                              : ''
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  {bpAlert && (
                                    <div className={`flex items-center space-x-1 text-xs ${
                                      bpAlert.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                      {bpAlert.level === 'critical' ? (
                                        <AlertCircle className="w-3 h-3" />
                                      ) : (
                                        <AlertTriangle className="w-3 h-3" />
                                      )}
                                      <span>{bpAlert.message}</span>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="heartRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fréquence Cardiaque (bpm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled={!selectedPatientId} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Température (°C)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" disabled={!selectedPatientId} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Poids (kg)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" disabled={!selectedPatientId} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taille (cm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled={!selectedPatientId} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes de Consultation</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="Symptômes, observations, plan de traitement..."
                                disabled={!selectedPatientId}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Alert Configuration Display */}
                      {alertConfig && selectedPatientId && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Seuils d'Alerte</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>TA Critique:</span>
                              <span>{alertConfig.systolicCritical}/{alertConfig.diastolicCritical} mmHg</span>
                            </div>
                            <div className="flex justify-between">
                              <span>TA Attention:</span>
                              <span>{alertConfig.systolicWarning}/{alertConfig.diastolicWarning} mmHg</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={createConsultationMutation.isPending || !selectedPatientId}
                      >
                        {createConsultationMutation.isPending ? "Enregistrement..." : "Enregistrer la Consultation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
