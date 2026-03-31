import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import TalentsPage from "./pages/Talents.tsx";
import HowItWorksPage from "./pages/HowItWorks.tsx";
import JoinPage from "./pages/Join.tsx";
import CreditsPage from "./pages/Credits.tsx";
import ContactPage from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/talents" element={<TalentsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
