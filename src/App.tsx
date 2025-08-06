import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { supabase } from "./utils/supabaseClient";

import { Auth }        from "./components/Auth";
import Navigation      from "./components/Navigation";
import Index           from "./pages/Index";
import BUCalculator    from "./pages/BUCalculator";
import SugarInput      from "./pages/SugarInput";
import NotFound        from "./pages/NotFound";

function HandleMagicLinkRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token  = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(() => {
            // заменяем URL на /sugar-input без хэша
            const cleanUrl = `${window.location.origin}/sugar-input`;
            window.history.replaceState(null, "", cleanUrl);
            navigate("/sugar-input", { replace: true });
          })
          .catch(console.error);
      } else {
        // если ошибка, просто убираем хэш
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      {/* 1) Форма логина */}
      <Auth />

      {/* 2) Обработчик magic-link */}
      <HandleMagicLinkRedirect />

      {/* 3) Навигация и маршруты */}
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
