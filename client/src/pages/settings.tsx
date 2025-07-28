import { useState } from "react";
import { FrenchSidebar } from "@/components/layout/french-sidebar";
import { FrenchHeader } from "@/components/layout/french-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Bell, Database, Shield, Users, Mail, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Paramètres généraux
    hospitalName: "Hôpital Central",
    department: "Service de Néphrologie",
    timezone: "Europe/Paris",
    
    // Paramètres d'alerte
    enableEmailAlerts: true,
    enableSmsAlerts: false,
    criticalAlertThreshold: 5,
    warningAlertThreshold: 10,
    
    // Paramètres de sécurité
    sessionTimeout: 60,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    
    // Paramètres d'affichage
    theme: "light",
    language: "fr",
    dateFormat: "dd/MM/yyyy",
    
    // Paramètres de sauvegarde
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 365,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès",
    });
  };

  const resetToDefaults = () => {
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres par défaut ont été restaurés",
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
              <p className="text-gray-600">
                Configurez les paramètres de l'application AI4CKD
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetToDefaults}>
                Réinitialiser
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Paramètres Généraux */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Paramètres Généraux</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Nom de l'établissement</Label>
                    <Input
                      id="hospitalName"
                      value={settings.hospitalName}
                      onChange={(e) => handleSettingChange('hospitalName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Service médical</Label>
                    <Input
                      id="department"
                      value={settings.department}
                      onChange={(e) => handleSettingChange('department', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Paramètres d'alertes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Paramètres d'Alertes</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailAlerts">Alertes par email</Label>
                        <p className="text-sm text-gray-500">Recevoir les alertes critiques par email</p>
                      </div>
                      <Switch
                        id="emailAlerts"
                        checked={settings.enableEmailAlerts}
                        onCheckedChange={(checked) => handleSettingChange('enableEmailAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsAlerts">Alertes par SMS</Label>
                        <p className="text-sm text-gray-500">Recevoir les alertes critiques par SMS</p>
                      </div>
                      <Switch
                        id="smsAlerts"
                        checked={settings.enableSmsAlerts}
                        onCheckedChange={(checked) => handleSettingChange('enableSmsAlerts', checked)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="criticalThreshold">Seuil alertes critiques</Label>
                        <Input
                          id="criticalThreshold"
                          type="number"
                          value={settings.criticalAlertThreshold}
                          onChange={(e) => handleSettingChange('criticalAlertThreshold', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="warningThreshold">Seuil alertes d'attention</Label>
                        <Input
                          id="warningThreshold"
                          type="number"
                          value={settings.warningAlertThreshold}
                          onChange={(e) => handleSettingChange('warningAlertThreshold', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Paramètres de sécurité */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Sécurité</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="strongPasswords">Mots de passe renforcés</Label>
                        <p className="text-sm text-gray-500">Exiger des mots de passe complexes</p>
                      </div>
                      <Switch
                        id="strongPasswords"
                        checked={settings.requireStrongPasswords}
                        onCheckedChange={(checked) => handleSettingChange('requireStrongPasswords', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                        <p className="text-sm text-gray-500">Sécurité supplémentaire pour la connexion</p>
                      </div>
                      <Switch
                        id="twoFactor"
                        checked={settings.enableTwoFactor}
                        onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar avec informations système */}
            <div className="space-y-6">
              {/* État du système */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>État du Système</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base de données</span>
                    <Badge variant="default" className="bg-green-500">
                      Connectée
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Serveur</span>
                    <Badge variant="default" className="bg-green-500">
                      En ligne
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                    <span className="text-sm text-gray-500">Il y a 2h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Version</span>
                    <Badge variant="outline">v1.0.0</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Utilisateurs connectés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Utilisateurs Actifs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">DR</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dr. Médecin</p>
                        <p className="text-xs text-gray-500">Connecté</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres de sauvegarde */}
              <Card>
                <CardHeader>
                  <CardTitle>Sauvegarde</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Sauvegarde automatique</Label>
                      <p className="text-sm text-gray-500">Sauvegarde quotidienne des données</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Fréquence</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Database className="mr-2 h-4 w-4" />
                    Sauvegarder Maintenant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}