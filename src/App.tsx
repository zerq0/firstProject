// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation   from "./components/Navigation";
import Index        from "./pages/Index";
import BUCalculator from "./pages/BUCalculator";
import SugarInput   from "./pages/SugarInput";
import NotFound     from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/"              element={<Index />} />
        <Route path="/bu-calculator" element={<BUCalculator />} />
        <Route path="/sugar-input"   element={<SugarInput />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </Router>
  );
}
