import { useState } from "react";
import authService from "../services/auth.service";

interface UseAuthReturn {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("accessToken");
  });

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async (): Promise<void> => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
