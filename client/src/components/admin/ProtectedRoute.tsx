import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setLocation("/admin/login");
      }
    };

    checkAuth();
  }, [setLocation]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
