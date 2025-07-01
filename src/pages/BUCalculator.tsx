import React, { useState, useEffect } from "react";
import { fetchProductByName } from "../utils/api";
import { calculateBreadUnits } from "../utils/calc";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Calculator } from "lucide-react";

interface Item {
  id: string;
  name: string;
  weight: string;
  carbs100g: number;
  fiber100g: number;
}

export default function BUCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: Date.now().toString(), name: "", weight: "", carbs100g: 0, fiber100g: 0 },
  ]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", weight: "", carbs100g: 0, fiber100g: 0 },
    ]);

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const updateItem = (id: string, changes: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...changes } : it))
    );

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const p = await fetchProductByName(query);
        setSuggestions([p]);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const selectProduct = (product: any, id: string) => {
    updateItem(id, {
      name: product.product_name,
      carbs100g: product.nutriments.carbohydrates_100g || 0,
      fiber100g: product.nutriments.fiber_100g || 0,
    });
    setSuggestions([]);
  };

  const totalBU = items.reduce((sum, it) => {
    const w = Number(it.weight) || 0;
    return sum + calculateBreadUnits(w, it.carbs100g, it.fiber100g);
  }, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-xl sm:max-w-3xl lg:max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="h-12 w-12 text-green-600" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">
            Калькулятор хлебных единиц
          </h1>
        </div>

        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 search-wrapper">
              <Input
                value={item.name}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateItem(item.id, { name: e.target.value });
                }}
                placeholder="Название продукта"
              />
              {loading && <div className="loading">…</div>}
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((p) => (
                    <li key={p.code} onClick={() => selectProduct(p, item.id)}>
                      {p.product_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Input
              value={item.weight}
              onChange={(e) => updateItem(item.id, { weight: e.target.value })}
              placeholder="Вес (г)"
              type="number"
              className="w-24"
            />

            <Button
              onClick={() => removeItem(item.id)}
              className="remove-btn"
            >
              Удалить
            </Button>
          </div>
        ))}

        <Button onClick={addItem} className="add-btn">
          + Добавить продукт
        </Button>

        <div className="total mt-6 text-lg text-right">
          Итого ХЕ: <strong>{Math.round(totalBU * 2) / 2}</strong>
        </div>
      </div>
    </div>
  );
}
