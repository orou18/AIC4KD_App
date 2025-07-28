import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import PatientDetail from "@/pages/patient-detail";
import PatientForm from "@/pages/patient-form";
import PatientsList from "@/pages/patients-list";
import Consultations from "@/pages/consultations";
import Alerts from "@/pages/alerts";
import Reports from "@/pages/reports";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import NewConsultation from "@/pages/new-consultation";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patients">
        <ProtectedRoute>
          <PatientsList />
        </ProtectedRoute>
      </Route>
      <Route path="/patients/new">
        <ProtectedRoute>
          <PatientForm />
        </ProtectedRoute>
      </Route>
      <Route path="/patients/:id">
        <ProtectedRoute>
          <PatientDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/consultations">
        <ProtectedRoute>
          <Consultations />
        </ProtectedRoute>
      </Route>
      <Route path="/new-consultation">
        <ProtectedRoute>
          <NewConsultation />
        </ProtectedRoute>
      </Route>
      <Route path="/alerts">
        <ProtectedRoute>
          <Alerts />
        </ProtectedRoute>
      </Route>
      <Route path="/reports">
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthInitializer>
          <Toaster />
          <Router />
        </AuthInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;