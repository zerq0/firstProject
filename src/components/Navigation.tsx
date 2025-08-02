import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, Calculator, TrendingUp } from "lucide-react";

const navItems = [
  { path: "/",            label: "Главная",         icon: Heart      },
  { path: "/bu-calculator", label: "Калькулятор ХЕ", icon: Calculator },
  { path: "/sugar-input",  label: "Учёт сахара",      icon: TrendingUp },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">DiabetEasy</span>
          </Link>
          <div className="flex overflow-x-auto space-x-2 no-scrollbar">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center shrink-0 gap-1 px-3 py-2 rounded-lg transition",
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-blue-700 hover:bg-blue-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
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
