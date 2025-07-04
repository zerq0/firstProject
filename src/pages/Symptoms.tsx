import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertTriangle, Droplets, Zap, Scale, Eye, Heart, Phone } from "lucide-react";

export default function Symptoms() {
  const emergency = [
    {
      title: "Кетоацидоз (КДК)",
      symptoms: ["Тошнота, рвота", "Боль в животе", "Фруктовый запах изо рта", "Учащённое дыхание", "Спутанность сознания"],
      action: "Немедл. обратиться к врачу",
    },
    {
      title: "Тяжёлая гипогликемия",
      symptoms: ["Спутанность сознания", "Судороги", "Невозможность пить/есть", "Сильная дрожь"],
      action: "Вызвать скорую помощь",
    },
    {
      title: "Гиперосмолярный синдром",
      symptoms: ["Сильное обезвоживание", "Высокая температура", "Галлюцинации", "Слабость с одной стороны"],
      action: "Срочная мед. помощь",
    },
  ];

  const common = [
    {
      icon: Droplets,
      title: "Частое мочеиспускание",
      description: "Потребность в туалете чаще обычного, особенно ночью",
      severity: "распространённый",
      color: "text-blue-600",
    },
    {
      icon: Droplets,
      title: "Сильная жажда",
      description: "Постоянное чувство сухости во рту и повышенный питьевой режим",
      severity: "распространённый",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Усталость",
      description: "Чувство слабости и усталости даже после отдыха",
      severity: "распространённый",
      color: "text-yellow-600",
    },
    {
      icon: Scale,
      title: "Необъяснимая потеря веса",
      description: "Снижение массы тела без диеты и усилий",
      severity: "тревожный",
      color: "text-orange-600",
    },
    {
      icon: Eye,
      title: "Понижение зрения",
      description: "Размытость и сложности с фокусировкой",
      severity: "тревожный",
      color: "text-purple-600",
    },
    {
      icon: Heart,
      title: "Длительное заживление ран",
      description: "Порезы и ранки заживают медленно",
      severity: "тревожный",
      color: "text-red-600",
    },
  ];

  const tips = [
    "Регулярно проверяйте уровень глюкозы",
    "Принимайте лекарства по назначению",
    "Соблюдайте сбалансированную диету",
    "Занимайтесь физической активностью",
    "Следите за гидратацией и гигиеной",
    "Посещайте врача согласно графику",
    "Учитесь распознавать свои сигналы",
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12 bg-gradient-to-b from-orange-50 to-red-50 min-h-screen">
      <div className="max-w-xl sm:max-w-4xl lg:max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-6">
          <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-orange-900 mb-2">
            Симптомы диабета
          </h1>
          <p className="text-base sm:text-lg text-orange-700">
            Как распознать и что делать.
          </p>
        </div>

        {/* Экстренные */}
        <Card className="p-4 sm:p-6 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Phone className="h-5 w-5" /> Экстренные симптомы
            </CardTitle>
            <CardDescription className="text-red-700">
              При появлении немедленно обращайтесь к врачу
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {emergency.map((e, i) => (
              <div key={i} className="bg-white p-4 rounded border border-red-200">
                <h3 className="font-bold text-red-900 mb-2">{e.title}</h3>
                <ul className="list-disc pl-5 text-sm text-red-700 mb-2">
                  {e.symptoms.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
                <div className="text-xs font-semibold text-red-800 bg-red-100 p-2 rounded">
                  {e.action}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Распространённые */}
        <Card className="p-4 sm:p-6 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-900">Распространённые</CardTitle>
            <CardDescription>Ранние признаки диабета</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {common.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white p-4 rounded border hover:shadow">
                  <div className="flex items-center mb-2 gap-2">
                    <Icon className={`h-6 w-6 ${c.color}`} />
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      {c.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Советы */}
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-green-900">Советы по управлению</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-decimal pl-5 space-y-2">
              {tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
