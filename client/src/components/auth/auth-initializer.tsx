
import { useEffect } from "react";
import { useLocation } from "wouter";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    
    // Si pas authentifié et pas sur la landing page, rediriger vers landing
    if (!authenticated && location !== "/landing") {
      setLocation("/landing");
    }
    
    // Si authentifié et sur la landing page, rediriger vers dashboard
    if (authenticated === "true" && location === "/landing") {
      setLocation("/");
    }
  }, [location, setLocation]);

  return <>{children}</>;
}
