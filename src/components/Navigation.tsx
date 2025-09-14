import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Calculator, TrendingUp, LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sub = supabase.auth
      .onAuthStateChange((_ev, session) => setAuthed(!!session))
      .data.subscription;
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    return () => sub?.unsubscribe();
  }, []);

  // Закрывать меню при смене маршрута
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const navItems = [
    { to: "/", label: "Главная", icon: Heart },
    { to: "/bu-calculator", label: "Калькулятор ХЕ", icon: Calculator },
    { to: "/sugar-input", label: "Ввод сахара", icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Лого */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-violet-600" />
            <span className="text-lg font-semibold text-violet-900">DiabetEasy</span>
          </Link>

          {/* Десктоп меню */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-violet-600 text-white"
                      : "text-violet-700 hover:bg-violet-50 hover:text-violet-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}

            {authed ? (
              <Button onClick={signOut} variant="outline" className="ml-1 inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            ) : (
              <Link
                to="/login"
                className="ml-1 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-violet-700 hover:bg-violet-50 hover:text-violet-900"
              >
                <LogIn className="h-4 w-4" />
                Войти
              </Link>
            )}
          </div>

          {/* Мобайльная кнопка */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-violet-700 hover:bg-violet-50"
            aria-label="Открыть меню"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобайльная панель */}
      {open && (
        <div className="md:hidden border-t border-indigo-100 bg-white/95 backdrop-blur">
          <div className="px-3 py-2 flex flex-col gap-1">
            {navItems.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm",
                    isActive
                      ? "bg-violet-600 text-white"
                      : "text-violet-700 hover:bg-violet-50 hover:text-violet-900"
                  )}
                >
                  {label}
                </Link>
              );
            })}

            {authed ? (
              <Button onClick={signOut} variant="outline" className="mt-1">
                Выйти
              </Button>
            ) : (
              <Link
                to="/login"
                className="mt-1 px-3 py-2 rounded-md text-sm text-violet-700 hover:bg-violet-50 hover:text-violet-900"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
