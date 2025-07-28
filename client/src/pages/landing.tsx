
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Users, Activity, Shield, FileText, Bell } from "lucide-react";
import { useLocation } from "wouter";

interface LoginForm {
  username: string;
  password: string;
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'authentification - remplacez par votre vraie logique
    setTimeout(() => {
      if (loginForm.username && loginForm.password) {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("user", JSON.stringify({ 
          username: loginForm.username,
          role: "doctor" 
        }));
        setLocation("/");
      }
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    {
      icon: Users,
      title: "Gestion des Patients",
      description: "Suivi complet des patients atteints de maladie rénale chronique"
    },
    {
      icon: Activity,
      title: "Consultations Médicales",
      description: "Enregistrement et suivi des consultations avec analyse des signes vitaux"
    },
    {
      icon: Bell,
      title: "Alertes Intelligentes",
      description: "Système d'alertes automatique basé sur les seuils configurables"
    },
    {
      icon: FileText,
      title: "Rapports PDF",
      description: "Génération automatique de rapports médicaux détaillés"
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Protection des données médicales avec authentification sécurisée"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HeartPulse className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI4CKD</h1>
                <p className="text-sm text-gray-500">Plateforme Médicale Intelligente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Gestion Intelligente des 
                <span className="text-blue-600"> Maladies Rénales Chroniques</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Une plateforme complète pour le suivi des patients, la gestion des consultations 
                et la génération d'alertes intelligentes pour améliorer les soins néphrologie.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Patients Suivis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Consultations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Surveillance</div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Connexion</CardTitle>
                <p className="text-center text-gray-600">
                  Accédez à votre espace médical sécurisé
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Entrez votre nom d'utilisateur"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Démo: utilisez n'importe quel nom d'utilisateur et mot de passe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional features section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre plateforme offre des outils complets pour une gestion efficace 
              des patients atteints de maladie rénale chronique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.slice(2).map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AI4CKD - Plateforme Médicale Intelligente. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
