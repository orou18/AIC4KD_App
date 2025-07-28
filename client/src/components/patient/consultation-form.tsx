import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertConsultationSchema } from "@shared/schema";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface ConsultationFormProps {
  patientId: string;
}

export function ConsultationForm({ patientId }: ConsultationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alertConfig } = useQuery({
    queryKey: ["/api/patients", patientId, "alert-config"],
  });

  const form = useForm({
    resolver: zodResolver(insertConsultationSchema),
    defaultValues: {
      patientId,
      creatinine: "",
      egfr: "",
      systolic: "",
      diastolic: "",
      weight: "",
      clinicalNotes: "",
    },
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/api/consultations`, {
        ...data,
        creatinine: data.creatinine ? data.creatinine.toString() : null,
        egfr: data.egfr ? parseInt(data.egfr) : null,
        systolic: data.systolic ? parseInt(data.systolic) : null,
        diastolic: data.diastolic ? parseInt(data.diastolic) : null,
        weight: data.weight ? data.weight.toString() : null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Consultation saved successfully. Alerts have been automatically generated.",
      });
      form.reset({
        patientId,
        creatinine: "",
        egfr: "",
        systolic: "",
        diastolic: "",
        weight: "",
        clinicalNotes: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save consultation",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createConsultationMutation.mutate(data);
  };

  // Alert checking functions
  const checkCreatinineAlert = (value: string) => {
    if (!value || !alertConfig) return null;
    const numValue = parseFloat(value);
    const critical = alertConfig.creatinineCritical ? parseFloat(alertConfig.creatinineCritical) : 3.0;
    const warning = alertConfig.creatinineWarning ? parseFloat(alertConfig.creatinineWarning) : 2.0;
    
    if (numValue >= critical) {
      return { level: 'critical', message: `Critical level (Normal: 0.6-1.2)` };
    } else if (numValue >= warning) {
      return { level: 'warning', message: `Elevated level (Normal: 0.6-1.2)` };
    }
    return null;
  };

  const checkEGFRAlert = (value: string) => {
    if (!value) return null;
    const numValue = parseInt(value);
    
    if (numValue < 15) {
      return { level: 'critical', message: `Stage 5 CKD (Normal: >60)` };
    } else if (numValue < 30) {
      return { level: 'warning', message: `Stage 4 CKD (Normal: >60)` };
    }
    return null;
  };

  const checkBPAlert = (systolic: string, diastolic: string) => {
    if (!systolic || !diastolic || !alertConfig) return null;
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const sysCritical = alertConfig.systolicCritical || 180;
    const diaCritical = alertConfig.diastolicCritical || 110;
    const sysWarning = alertConfig.systolicWarning || 140;
    const diaWarning = alertConfig.diastolicWarning || 90;
    
    if (sys >= sysCritical || dia >= diaCritical) {
      return { level: 'critical', message: `Severe Hypertension (Normal: <120/80)` };
    } else if (sys >= sysWarning || dia >= diaWarning) {
      return { level: 'warning', message: `Hypertension (Normal: <120/80)` };
    }
    return null;
  };

  const creatinineAlert = checkCreatinineAlert(form.watch('creatinine'));
  const egfrAlert = checkEGFRAlert(form.watch('egfr'));
  const bpAlert = checkBPAlert(form.watch('systolic'), form.watch('diastolic'));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Consultation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="creatinine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creatinine (mg/dL)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          className={
                            creatinineAlert?.level === 'critical'
                              ? 'border-red-300 bg-red-50 focus:border-red-500'
                              : creatinineAlert?.level === 'warning'
                              ? 'border-yellow-300 bg-yellow-50 focus:border-yellow-500'
                              : ''
                          }
                        />
                        {creatinineAlert && (
                          <div className={`flex items-center space-x-1 text-xs ${
                            creatinineAlert.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {creatinineAlert.level === 'critical' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            <span>{creatinineAlert.message}</span>
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
                name="egfr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>eGFR (mL/min/1.73m²)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          {...field}
                          type="number"
                          className={
                            egfrAlert?.level === 'critical'
                              ? 'border-red-300 bg-red-50 focus:border-red-500'
                              : egfrAlert?.level === 'warning'
                              ? 'border-yellow-300 bg-yellow-50 focus:border-yellow-500'
                              : ''
                          }
                        />
                        {egfrAlert && (
                          <div className={`flex items-center space-x-1 text-xs ${
                            egfrAlert.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {egfrAlert.level === 'critical' ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            <span>{egfrAlert.message}</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            {...field}
                            type="number"
                            placeholder="Systolic"
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
                            name="diastolic"
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                placeholder="Diastolic"
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
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="clinicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinical Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Patient symptoms, observations, treatment plan..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alert Configuration Display */}
            {alertConfig && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Alert Thresholds</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Creatinine Critical:</span>
                    <span>{alertConfig.creatinineCritical} mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creatinine Warning:</span>
                    <span>{alertConfig.creatinineWarning} mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BP Critical:</span>
                    <span>{alertConfig.systolicCritical}/{alertConfig.diastolicCritical} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BP Warning:</span>
                    <span>{alertConfig.systolicWarning}/{alertConfig.diastolicWarning} mmHg</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-medical-blue hover:bg-medical-light"
              disabled={createConsultationMutation.isPending}
            >
              {createConsultationMutation.isPending ? "Saving..." : "Save Consultation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
