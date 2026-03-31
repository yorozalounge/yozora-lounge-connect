import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import TalentsPage from "./pages/Talents.tsx";
import HowItWorksPage from "./pages/HowItWorks.tsx";
import CreditsPage from "./pages/Credits.tsx";
import ContactPage from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import SignupClient from "./pages/SignupClient.tsx";
import SignupTalent from "./pages/SignupTalent.tsx";
import TalentProfile from "./pages/TalentProfile.tsx";
import ClientDashboard from "./pages/ClientDashboard.tsx";
import TalentDashboard from "./pages/TalentDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import NotFound from "./pages/NotFound.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/talents" element={<TalentsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/join" element={<SignupTalent />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/client" element={<SignupClient />} />
            <Route path="/signup/talent" element={<SignupTalent />} />
            <Route path="/talent/:id" element={<TalentProfile />} />
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/talent-dashboard"
              element={
                <ProtectedRoute requiredRole="talent">
                  <TalentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
