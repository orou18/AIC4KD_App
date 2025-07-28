
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem("authenticated");
      if (authenticated === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setLocation("/landing");
      }
    };

    checkAuth();
  }, [setLocation]);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to landing
  }

  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/landing");
  };

  return { user, logout };
}
