"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        router.push("/admin/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
