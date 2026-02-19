// In src/hooks/use-route-auth.ts
import { useAuth } from "~/hooks/api";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/signin' });
    }
  }, [isAuthenticated, navigate]);
  
  return { isAuthenticated };
}