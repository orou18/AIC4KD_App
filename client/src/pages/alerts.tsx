import { useQuery, useMutation } from "@tanstack/react-query";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Eye, Check, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  patientId: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  message: string;
  parameter: string;
  value: string;
  threshold: string;
  createdAt: string;
  patient?: {
    id: string;
    fullName: string;
    patientId: string;
  };
}

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await apiRequest(`/api/alerts/${alertId}/acknowledge`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerte acquittée",
        description: "L'alerte a été marquée comme acquittée",
      });
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await apiRequest(`/api/alerts/${alertId}/resolve`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerte résolue",
        description: "L'alerte a été marquée comme résolue",
      });
    },
  });

  const filteredAlerts = (alerts || []).filter(alert => {
    const matchesSearch = 
      alert.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.patient?.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.parameter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Critique';
      case 'warning':
        return 'Attention';
      default:
        return 'Info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'acknowledged':
        return 'Acquittée';
      case 'resolved':
        return 'Résolue';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedAlerts = filteredAlerts.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <FrenchSidebar />
      <div className="flex-1 flex flex-col">
        <FrenchHeader />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Alertes</h1>
              <p className="text-gray-600">
                {alerts?.filter(a => a.status === 'active').length || 0} alerte(s) active(s) sur {alerts?.length || 0} total
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par patient, message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="acknowledged">Acquittées</SelectItem>
                    <SelectItem value="resolved">Résolues</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par sévérité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sévérités</SelectItem>
                    <SelectItem value="critical">Critiques</SelectItem>
                    <SelectItem value="warning">Attention</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4 p-4">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedAlerts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune alerte trouvée</p>
                  {(searchTerm || statusFilter !== "all" || severityFilter !== "all") && (
                    <p className="text-sm">Essayez de modifier vos filtres</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (alert.patient?.id) {
                          window.location.href = `/patients/${alert.patient.id}`;
                        }
                      }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Link href={`/patients/${alert.patient?.id}`}>
                                <span className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                  {alert.patient?.fullName || 'Patient inconnu'}
                                </span>
                              </Link>
                              <Badge variant="outline" className="text-xs">
                                {alert.patient?.patientId}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(alert.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Paramètre: {alert.parameter}</span>
                              <span>Valeur: {alert.value}</span>
                              <span>Seuil: {alert.threshold}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {getSeverityText(alert.severity)}
                              </Badge>
                              <Badge variant="outline">
                                {getStatusText(alert.status)}
                              </Badge>
                              
                              <div className="flex space-x-1">
                                {alert.status === 'active' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        acknowledgeAlertMutation.mutate(alert.id);
                                      }}
                                      disabled={acknowledgeAlertMutation.isPending}
                                      title="Marquer comme acquittée"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resolveAlertMutation.mutate(alert.id);
                                      }}
                                      disabled={resolveAlertMutation.isPending}
                                      title="Marquer comme résolue"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {alert.status === 'acknowledged' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      resolveAlertMutation.mutate(alert.id);
                                    }}
                                    disabled={resolveAlertMutation.isPending}
                                    title="Marquer comme résolue"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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