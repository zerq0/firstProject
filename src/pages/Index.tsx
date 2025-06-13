// src/pages/Index.tsx
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Heart className="h-16 w-16 text-blue-600 mx-auto" />
          <h1 className="text-5xl font-bold text-blue-900">
            Добро пожаловать в DiabetesCare
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Ваш помощник в управлении диабетом: учет сахара, расчёт дозы
            инсулина и отслеживание симптомов.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="text-center border-blue-200">
                <CardContent>
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-900">{s.value}</div>
                  <div className="text-blue-600">{s.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="border-blue-200">
                <CardHeader className="text-center">
                  <Icon className={`h-8 w-8 ${f.color} mx-auto mb-2`} />
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
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
