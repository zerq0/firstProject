import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { HelpButton } from "@/components/Help";

type Item = { id: string; title: string; grams: number; carbsPer100: number };

export default function BUCalculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [grams, setGrams] = useState("");
  const [carbsPer100, setCarbsPer100] = useState("");

  function addItem() {
    const g = parseFloat(grams.replace(",", "."));
    const c = parseFloat(carbsPer100.replace(",", "."));
    if (!title.trim() || isNaN(g) || isNaN(c)) return;
    if (c <= 0) {
      alert("У продукта 0 г углеводов/100г — исключаем.");
      return;
    }
    setItems((prev) => [{ id: String(Date.now()), title: title.trim(), grams: g, carbsPer100: c }, ...prev]);
    setTitle(""); setGrams(""); setCarbsPer100("");
  }
  function removeItem(id: string) { setItems((prev) => prev.filter((i) => i.id !== id)); }

  const totalBU = useMemo(() => {
    const sumCarbs = items.reduce((acc, i) => acc + (i.grams * i.carbsPer100 / 100), 0);
    return +(sumCarbs / 12).toFixed(2); // 1 ХЕ = 12 г углеводов
  }, [items]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-violet-900">Калькулятор ХЕ</h1>

          <div className="flex gap-2">
            {/* FatSecret CTA */}
            <a
              href="https://www.fatsecret.com/Diary.aspx?pa=fj"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm shadow-sm"
              title="Открыть FatSecret в новой вкладке"
            >
              FatSecret <ExternalLink className="h-4 w-4" />
            </a>

            <HelpButton title="Как пользоваться калькулятором ХЕ?">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Впиши название продукта, его граммовку и углеводы (г на 100 г).</li>
                <li>Нажми «Добавить» — продукт появится в списке ниже.</li>
                <li>Система посчитает индивидуальные ХЕ и общий итог (1 ХЕ = 12 г углеводов).</li>
                <li>Нули по углеводам не добавляются, чтобы не мусорить расчёт.</li>
                <li>Для поиска БЖУ можно перейти в FatSecret (кнопка рядом).</li>
              </ol>
            </HelpButton>
          </div>
        </div>

        <div className="panel p-4 space-y-3">
          <Input
            placeholder="Название продукта"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Граммовка, г (например 120)"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
            />
            <Input
              placeholder="Углеводы, г на 100 г (например 60)"
              value={carbsPer100}
              onChange={(e) => setCarbsPer100(e.target.value)}
            />
          </div>
          <Button className="btn-primary" onClick={addItem}>
            Добавить продукт
          </Button>
        </div>

        <div className="panel p-4">
          <h2 className="font-semibold mb-2 text-violet-900">Список</h2>
          {items.length === 0 ? (
            <div className="text-slate-500">Пусто</div>
          ) : (
            <ul className="space-y-2">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between items-start bg-violet-50/60 p-2 rounded">
                  <div>
                    <div className="font-semibold text-violet-900">{i.title}</div>
                    <div className="text-sm text-slate-600">
                      {i.grams} г • {i.carbsPer100} г угл/100г • ХЕ: {(i.grams * i.carbsPer100 / 1200).toFixed(2)}
                    </div>
                  </div>
                  <button className="text-rose-600 text-sm hover:underline" onClick={() => removeItem(i.id)}>
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 font-semibold text-violet-900">Итого: {totalBU} ХЕ</div>
        </div>
      </div>
    </div>
  );
}
