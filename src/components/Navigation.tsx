import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Calculator, TrendingUp, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sub = supabase.auth
      .onAuthStateChange((_ev, session) => setAuthed(!!session))
      .data.subscription;
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    return () => sub?.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/"); // на главную
  }

  const navItems = [
    { to: "/", label: "На главную", icon: Heart },
    { to: "/bu-calculator", label: "Калькулятор ХЕ", icon: Calculator },
    { to: "/sugar-input", label: "Ввод сахара", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Лого */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">DiabetEasy</span>
          </Link>

          {/* Меню */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}

            {/* Авторизация */}
            {authed ? (
              <Button
                onClick={signOut}
                variant="outline"
                className="ml-1 inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            ) : (
              <Link
                to="/login"
                className="ml-1 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-900"
              >
                <LogIn className="h-4 w-4" />
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
