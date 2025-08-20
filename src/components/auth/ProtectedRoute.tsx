import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldOff } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, hasPermission, isLoadingUser, isAuthenticating } = useAuth();
  const location = useLocation();

  // ⏳ Bloquear la evaluación mientras se carga o se hace login
  if (isLoadingUser || isAuthenticating) {
    return <div>Cargando...</div>; // o spinner bonito
  }

  // 🔒 Si no hay usuario después de cargar, mandamos al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🛑 Si no tiene permisos, mostrar alerta
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="flex items-center gap-2">
          <ShieldOff className="h-5 w-5" />
          <AlertDescription>
            No tienes permisos suficientes para acceder a esta sección.
            Se requiere uno de los siguientes roles:{"SUPERUSER,ADMIN"}
            <strong>{requiredRoles.join(", ")}</strong>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ✅ Todo correcto, renderizar contenido
  return <>{children}</>;
}
