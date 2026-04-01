import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import TalentsPage from "./pages/Talents.tsx";
import HowItWorksPage from "./pages/HowItWorks.tsx";
import CreditsPage from "./pages/Credits.tsx";
import ContactPage from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import SignupClient from "./pages/SignupClient.tsx";
import SignupTalent from "./pages/SignupTalent.tsx";
import TalentProfile from "./pages/TalentProfile.tsx";
import MySessions from "./pages/MySessions.tsx";
import CallScreen from "./pages/CallScreen.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

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
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/call/:bookingId" element={<CallScreen />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
