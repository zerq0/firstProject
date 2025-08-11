// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import BUCalculator from './pages/BUCalculator';
import SugarInput from './pages/SugarInput';
import NotFound from './pages/NotFound';
import LoginOTP from './pages/LoginOTP';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginOTP />} />
        <Route path="/bu-calculator" element={<BUCalculator />} />
        <Route
          path="/sugar-input"
          element={
            <RequireAuth>
              <SugarInput />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
