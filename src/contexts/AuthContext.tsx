import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as authService from "@/services/authService";

export type UserRole = "superadmin" | "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  isLoadingUser: boolean; // cargando usuario inicial
  isAuthenticating: boolean; // login en curso
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Carga inicial de usuario desde token
  useEffect(() => {
    const initialize = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoadingUser(false);
    };
    initialize();
  }, []);

  // Login con actualización inmediata de user
  const login = async (email: string, password: string, remember = false) => {
    setIsAuthenticating(true);
    try {
      await authService.login(email, password, remember);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === "superadmin") return true;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoadingUser,
        isAuthenticating,
        hasPermission,
      }}
    >
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
