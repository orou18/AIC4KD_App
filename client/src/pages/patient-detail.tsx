import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PatientForm } from "@/components/patient/patient-form";
import { ConsultationForm } from "@/components/patient/consultation-form";
import { PDFPreview } from "@/components/pdf/pdf-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Activity, 
  AlertTriangle,
  Plus,
  FileText,
  Edit,
  Download,
  Trash2
} from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PatientDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ["/api/patients", id],
    enabled: !!id,
  });

  const downloadPDFMutation = useMutation({
    mutationFn: async () => {
      if (!patient) return;

      const response = await fetch(`/api/patients/${patient.id}/report`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `rapport-patient-${patient.fullName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "PDF téléchargé",
        description: "Le rapport patient a été téléchargé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le rapport PDF",
        variant: "destructive",
      });
    },
  });

  const deletePatientMutation = useMutation({
    mutationFn: async () => {
      if (!patient) return;
      return await apiRequest(`/api/patients/${patient.id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({
        title: "Patient supprimé",
        description: "Le patient a été supprimé avec succès",
      });
      setLocation("/patients");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le patient",
        variant: "destructive",
      });
    },
  });

  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-medical-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex bg-medical-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>Patient not found or failed to load</p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-medical-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PatientForm patient={patient} />
              <ConsultationForm patientId={patient.id} />
            </div>
            <PDFPreview patient={patient} />

            <div>
              <Button 
                  variant="outline" 
                  onClick={() => downloadPDFMutation.mutate()}
                  disabled={downloadPDFMutation.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadPDFMutation.isPending ? "Génération..." : "Télécharger PDF"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer Patient
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le patient <strong>{patient?.fullName}</strong> ? 
                        Cette action est irréversible et supprimera toutes les consultations et données associées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePatientMutation.mutate()}
                        disabled={deletePatientMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deletePatientMutation.isPending ? "Suppression..." : "Supprimer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}