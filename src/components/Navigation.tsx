// src/components/Navigation.tsx
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, Calculator, TrendingUp, AlertTriangle } from "lucide-react";

const navItems = [
  { path: "/",            label: "На главную",      icon: Heart },
  { path: "/bu-calculator", label: "Калькулятор ХЕ", icon: Calculator },
  { path: "/sugar-input",  label: "Ввод сахара",     icon: TrendingUp },
  { path: "/symptoms",     label: "Симптоматика",    icon: AlertTriangle },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-blue-900">DiabetEasy</h1>
          </div>

          {/* Меню: скролл + иконки на мобилках */}
          <div className="flex overflow-x-auto space-x-1 sm:space-x-4 no-scrollbar">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center shrink-0 gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {/* текст только на ширине ≥640px */}
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
