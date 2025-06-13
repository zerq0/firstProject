
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, Calculator, TrendingUp, AlertTriangle } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Main", icon: Heart },
    { path: "/bu-calculator", label: "BU Calculator", icon: Calculator },
    { path: "/sugar-input", label: "Sugar Input", icon: TrendingUp },
    { path: "/symptoms", label: "Symptoms", icon: AlertTriangle },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-blue-900">DiabetesCare</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
