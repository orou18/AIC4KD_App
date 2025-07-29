
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Users, Bell } from "lucide-react";
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
      title: "Patients",
      description: "Suivi simple et rapide des patients."
    },
    {
      icon: Bell,
      title: "Alertes",
      description: "Notifications automatiques en cas de problème."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 animate-gradient-x transition-all duration-1000">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <HeartPulse className="text-white text-2xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">nephrosense IA</h1>
                <p className="text-sm text-gray-500">L’IA au service de la néphrologie</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-14 lg:flex-row lg:items-start lg:gap-24">
          <div className="space-y-10 max-w-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-xl mb-2">
                <HeartPulse className="text-white w-14 h-14 animate-pulse" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight drop-shadow-lg">
                La nouvelle ère du suivi rénal
              </h1>
              <p className="text-lg text-gray-600 text-center max-w-md">
                Plateforme intelligente, intuitive et sécurisée pour les professionnels de la néphrologie.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl group border border-blue-100"
                >
                  <div className="mb-3">
                    <feature.icon className="w-10 h-10 text-blue-500 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-1 text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <div className="inline-block px-8 py-6 bg-gradient-to-br from-green-200 to-blue-100 rounded-2xl shadow-lg border-2 border-blue-200">
                <span className="text-3xl font-extrabold text-green-700 drop-shadow">500+</span>
                <span className="ml-3 text-lg text-gray-700 font-medium">patients suivis</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-md gap-6">
            <Card className="w-full shadow-2xl border-0 rounded-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center font-bold text-blue-700">Connexion</CardTitle>
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-md rounded-xl transition-all"
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 nephrosense IA - Plateforme Médicale Intelligente. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
