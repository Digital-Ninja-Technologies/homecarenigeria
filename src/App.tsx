import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Login from "./pages/Login";
import SignupClient from "./pages/SignupClient";
import SignupWorker from "./pages/SignupWorker";
import SignupAgency from "./pages/SignupAgency";
import HowItWorks from "./pages/HowItWorks";
import ForWorkers from "./pages/ForWorkers";
import ForAgencies from "./pages/ForAgencies";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import WorkerDashboard from "./pages/dashboard/WorkerDashboard";
import AgencyDashboard from "./pages/dashboard/AgencyDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:category" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-workers" element={<ForWorkers />} />
            <Route path="/for-agencies" element={<ForAgencies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/client" element={<SignupClient />} />
            <Route path="/signup/worker" element={<SignupWorker />} />
            <Route path="/signup/agency" element={<SignupAgency />} />
            
            {/* Client Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Worker Dashboard Routes */}
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['worker']}>
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/*"
              element={
                <ProtectedRoute allowedRoles={['worker']}>
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Agency Dashboard Routes */}
            <Route
              path="/agency/dashboard"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agency/*"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
