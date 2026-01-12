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
import SearchWorkers from "./pages/dashboard/search";
import BookWorker from "./pages/dashboard/book";
import ClientBookings from "./pages/dashboard/bookings";
import MessagesPage from "./pages/dashboard/messages";
import ReviewsPage from "./pages/dashboard/reviews";
import SettingsPage from "./pages/dashboard/settings";
import WorkerBookings from "./pages/worker/bookings";
import WorkerEarnings from "./pages/worker/earnings";
import WorkerDocuments from "./pages/worker/documents";
import WorkerProfile from "./pages/worker/profile";
import AgencyWorkers from "./pages/agency/workers";
import AgencyProfile from "./pages/agency/profile";
import WorkerDetail from "./pages/workers/[id]";
import PublicBooking from "./pages/book/[id]";
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
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/book/:id" element={<PublicBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/client" element={<SignupClient />} />
            <Route path="/signup/worker" element={<SignupWorker />} />
            <Route path="/signup/agency" element={<SignupAgency />} />
            
            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/search" element={<ProtectedRoute allowedRoles={['client']}><SearchWorkers /></ProtectedRoute>} />
            <Route path="/dashboard/book/:workerId" element={<ProtectedRoute allowedRoles={['client']}><BookWorker /></ProtectedRoute>} />
            <Route path="/dashboard/bookings" element={<ProtectedRoute allowedRoles={['client']}><ClientBookings /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute allowedRoles={['client']}><MessagesPage userType="client" /></ProtectedRoute>} />
            <Route path="/dashboard/reviews" element={<ProtectedRoute allowedRoles={['client']}><ReviewsPage userType="client" /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['client']}><SettingsPage userType="client" /></ProtectedRoute>} />
            
            {/* Worker Dashboard Routes */}
            <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
            <Route path="/worker/bookings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerBookings /></ProtectedRoute>} />
            <Route path="/worker/earnings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerEarnings /></ProtectedRoute>} />
            <Route path="/worker/messages" element={<ProtectedRoute allowedRoles={['worker']}><MessagesPage userType="worker" /></ProtectedRoute>} />
            <Route path="/worker/reviews" element={<ProtectedRoute allowedRoles={['worker']}><ReviewsPage userType="worker" /></ProtectedRoute>} />
            <Route path="/worker/profile" element={<ProtectedRoute allowedRoles={['worker']}><WorkerProfile /></ProtectedRoute>} />
            <Route path="/worker/documents" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDocuments /></ProtectedRoute>} />
            <Route path="/worker/settings" element={<ProtectedRoute allowedRoles={['worker']}><SettingsPage userType="worker" /></ProtectedRoute>} />
            
            {/* Agency Dashboard Routes */}
            <Route path="/agency/dashboard" element={<ProtectedRoute allowedRoles={['agency']}><AgencyDashboard /></ProtectedRoute>} />
            <Route path="/agency/workers" element={<ProtectedRoute allowedRoles={['agency']}><AgencyWorkers /></ProtectedRoute>} />
            <Route path="/agency/bookings" element={<ProtectedRoute allowedRoles={['agency']}><ClientBookings /></ProtectedRoute>} />
            <Route path="/agency/earnings" element={<ProtectedRoute allowedRoles={['agency']}><WorkerEarnings /></ProtectedRoute>} />
            <Route path="/agency/messages" element={<ProtectedRoute allowedRoles={['agency']}><MessagesPage userType="agency" /></ProtectedRoute>} />
            <Route path="/agency/profile" element={<ProtectedRoute allowedRoles={['agency']}><AgencyProfile /></ProtectedRoute>} />
            <Route path="/agency/settings" element={<ProtectedRoute allowedRoles={['agency']}><SettingsPage userType="agency" /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
