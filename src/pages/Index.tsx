import React from "react";
import { Link } from "react-router-dom";
import { Heart, Calculator, TrendingUp, Activity, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { HelpButton } from "@/components/Help";

export default function Index() {
  const features = [
    {
      icon: Calculator,
      title: "Калькулятор ХЕ",
      description: "Быстро считай углеводы и общие ХЕ блюда. Помогает оценить дозу.",
      link: "/bu-calculator",
      chip: "Расчёты без боли",
      color: "text-rose-600",
    },
    {
      icon: TrendingUp,
      title: "Учёт сахара",
      description: "Добавляй замеры, фильтруй по типам и смотри средние значения.",
      link: "/sugar-input",
      chip: "История и аналитика",
      color: "text-violet-600",
    },
  ];

  const stats = [
    { icon: Users, value: "463 млн", label: "диабетиков в мире" },
    { icon: Activity, value: "1 из 10", label: "взрослых затронуты" },
    { icon: Shield, value: "до 90%", label: "случаев можно предотвратить" },
  ];

  const steps = [
    { title: "Войти по коду", desc: "Мы шлём OTP на email — без паролей.", num: "01" },
    { title: "Добавить замеры", desc: "Фиксируй глюкозу, тип замера и заметки.", num: "02" },
    { title: "Считать ХЕ", desc: "Вбивай продукты, граммовку и углеводы.", num: "03" },
    { title: "Следить за динамикой", desc: "Фильтруй и смотри средние по типам.", num: "04" },
  ];

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
      {/* Градиентные блобы */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-rose-300/40 blur-3xl" />
        <div className="absolute top-32 -right-10 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* HERO */}
        <section className="relative rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur p-6 sm:p-10 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                v1 — OTP-логин, фильтры по типам, ХЕ-калькулятор
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-violet-900">
                DiabetEasy — контроль диабета <span className="text-rose-600">без лишней мороки</span>
              </h1>
              <p className="mt-3 text-violet-700 text-base sm:text-lg">
                Веди замеры сахара по типам, считай хлебные единицы, держи всё под рукой.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-start justify-center">
                <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Link to="/sugar-input" className="inline-flex items-center gap-2">
                    Начать учёт <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                  <Link to="/bu-calculator">Калькулятор ХЕ</Link>
                </Button>
                <HelpButton className="sm:ml-2" title="Как начать?">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Зайдите на страницу «Войти» и введите email — получите 6-значный код.</li>
                    <li>В «Учёте сахара» добавляйте замеры и выбирайте тип (натощак, после еды и т.д.).</li>
                    <li>В «Калькуляторе ХЕ» вбейте продукты и их БЖУ — увидите итог по ХЕ.</li>
                  </ul>
                </HelpButton>
              </div>
            </div>

            {/* Красивая карточка-иллюстрация */}
            <Card className="flex-1 w-full max-w-lg border-indigo-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-violet-900">Быстрый обзор</CardTitle>
                <CardDescription>Что умеет приложение прямо сейчас</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <MiniTile title="OTP-вход" caption="Без паролей" />
                <MiniTile title="Замеры" caption="С фильтрами" />
                <MiniTile title="Среднее" caption="По типам" />
                <MiniTile title="ХЕ-счёт" caption="12 г = 1 ХЕ" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* СТАТЫ */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-indigo-100 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Icon className="h-10 w-10 text-violet-600 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-violet-900">{s.value}</div>
                  <div className="text-violet-700">{s.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* ФИЧИ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-violet-900 mb-4">Что внутри</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="group border-indigo-100 bg-white/80 backdrop-blur overflow-hidden">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-violet-50 p-3 group-hover:bg-violet-100 transition">
                      <Icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5 mb-2">
                        {f.chip}
                      </div>
                      <h3 className="text-lg font-semibold text-violet-900">{f.title}</h3>
                      <p className="text-sm text-violet-700 mt-1">{f.description}</p>
                      <div className="mt-3">
                        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                          <Link to={f.link} className="inline-flex items-center gap-2">
                            Перейти <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-violet-900 mb-4">Как это работает</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <Card key={s.num} className="border-indigo-100 bg-white/80 backdrop-blur">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold text-rose-700">{s.num}</div>
                  <div className="mt-1 text-violet-900 font-semibold">{s.title}</div>
                  <div className="text-sm text-violet-700">{s.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-violet-600 to-rose-600 p-6 sm:p-10 text-white text-center">
          <h3 className="text-2xl sm:text-3xl font-bold">Готов начать?</h3>
          <p className="mt-2 text-white/90">
            Залогинься по коду и добавь первые замеры — базовый контроль уже через пару минут.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-white text-violet-700 hover:bg-violet-50">
              <Link to="/login">Войти по коду</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/70 text-white hover:bg-white/10">
              <Link to="/sugar-input">К учёту сахара</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Мини-плитка для «Быстрого обзора» в хиро */
function MiniTile({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-violet-50/40 p-3">
      <div className="text-sm font-semibold text-violet-900">{title}</div>
      <div className="text-xs text-violet-700">{caption}</div>
    </div>
  );
}
