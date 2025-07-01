import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Calculator, TrendingUp, AlertTriangle, Activity, Shield, Users } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Calculator,
      title: "Калькулятор ХЕ",
      description: "Рассчитай хлебные единицы и дозу инсулина для контроля глюкозы.",
      link: "/bu-calculator",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      title: "Учет сахара",
      description: "Записывай и отслеживай уровень глюкозы в крови.",
      link: "/sugar-input",
      color: "text-blue-600",
    },
    {
      icon: AlertTriangle,
      title: "Симптомы",
      description: "Узнай признаки и предупреждающие сигналы диабета.",
      link: "/symptoms",
      color: "text-orange-600",
    },
  ];

  const stats = [
    { icon: Users, value: "463 млн", label: "диабетиков в мире" },
    { icon: Activity, value: "1 из 10", label: "взрослых страдает" },
    { icon: Shield, value: "90 %", label: "можно предотвратить" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <div className="max-w-xl sm:max-w-3xl lg:max-w-5xl mx-auto space-y-16">
        {/* Хедер */}
        <div className="text-center mb-6">
          <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-2">
            Добро пожаловать в DiabetEasy
          </h1>
          <p className="text-base sm:text-lg text-blue-700">
            Ваш помощник в управлении диабетом: учёт сахара, расчёт дозы
            инсулина и отслеживание симптомов.
          </p>
        </div>

        {/* Статистика */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-4 sm:p-6 border-blue-200 text-center">
                <CardContent>
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-900">{s.value}</div>
                  <div className="text-blue-600">{s.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Фичи */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="p-4 sm:p-6 border-blue-200">
                <CardHeader className="text-center">
                  <Icon className={`h-8 w-8 ${f.color} mx-auto mb-2`} />
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to={f.link}>Перейти</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
