import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index        from "./pages/Index";
import BUCalculator from "./pages/BUCalculator";
import SugarInput   from "./pages/SugarInput";
import Symptoms     from "./pages/Symptoms";
import NotFound     from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/"              element={<Index />} />
          <Route path="/bu-calculator" element={<BUCalculator />} />
          <Route path="/sugar-input"   element={<SugarInput />} />
          <Route path="/symptoms"      element={<Symptoms />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
