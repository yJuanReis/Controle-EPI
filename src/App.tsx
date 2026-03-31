import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EPIProvider } from "./contexts/EPIContext";
import { NotificacoesProvider } from "./contexts/NotificacoesContext";
import { InspecaoProvider } from "./contexts/InspecaoContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Estoque from "./pages/Estoque";
import Colaboradores from "./pages/Colaboradores";
import Relatorios from "./pages/Relatorios";
import EntregasDevolucoes from "./pages/EntregasDevoluções";
import Inspecoes from "./pages/Inspecoes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import Configuracoes from "./pages/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EPIProvider>
        <InspecaoProvider>
          <NotificacoesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Rota pública */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rotas protegidas */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/estoque" element={
                    <ProtectedRoute>
                      <Estoque />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/colaboradores" element={
                    <ProtectedRoute>
                      <Colaboradores />
                    </ProtectedRoute>
                  } />

                  <Route path="/relatorios" element={
                    <ProtectedRoute>
                      <Relatorios />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/entregas-devolucoes" element={
                    <ProtectedRoute>
                      <EntregasDevolucoes />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/inspecoes" element={
                    <ProtectedRoute>
                      <Inspecoes />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rotas protegidas que requerem admin */}
                  <Route path="/configuracoes" element={
                    <ProtectedRoute requireAdmin={true}>
                      <Configuracoes />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/gerenciar-usuarios" element={
                    <ProtectedRoute requireAdmin={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redireciona para login se não estiver autenticado */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </NotificacoesProvider>
        </InspecaoProvider>
      </EPIProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;