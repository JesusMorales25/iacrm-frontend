import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
       <BrowserRouter>
					<Routes>
						{/* Rutas públicas */}
						<Route path="/login" element={<Login />} />

						{/* Rutas protegidas - requieren autenticación */}
						<Route
							element={
								<ProtectedRoute>
									<ResponsiveLayout>
										<Outlet />
									</ResponsiveLayout>
								</ProtectedRoute>
							}
						>
							<Route path="/" element={<Index />} />
							<Route path="/leads" element={<Leads />} />
							<Route path="/chat" element={<Chat />} />
							<Route path="/reportes" element={<Reports />} />
							
							{/* Rutas con roles */}
							<Route
								path="/configuracion"
								element={
									<ProtectedRoute requiredRoles={['admin', 'superadmin']}>
										<Settings />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/usuarios"
								element={
									<ProtectedRoute requiredRoles={['admin', 'superadmin']}>
										<Users />
									</ProtectedRoute>
								}
							/>
						</Route>

						{/* Catch all */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>




      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
