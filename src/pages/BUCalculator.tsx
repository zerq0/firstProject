import React, { useState } from "react";
import { fetchProductByName, Product } from "../utils/api";
import { calculateBreadUnits }         from "../utils/calc";
import { Input }  from "../components/ui/input";
import { Button } from "../components/ui/button";

interface Item {
  id: string;
  product: Product;
  weight: number;
  bu: number;
}

export default function BUCalculator() {
  const [query, setQuery]             = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selected, setSelected]       = useState<Product | null>(null);
  const [weight, setWeight]           = useState("");
  const [items, setItems]             = useState<Item[]>([]);
  const [loading, setLoading]         = useState(false);

  const onSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const prods = await fetchProductByName(query);
      // Шаг 1: отсеять нулевые углеводы, шаг 2: взять первые 10
      setSuggestions(
        prods
          .filter(p => (p.nutriments.carbohydrates_100g ?? 0) > 0)
          .slice(0, 10)
      );
    } catch (err: any) {
      alert("Ошибка поиска: " + err.message);
    }
    setLoading(false);
  };

  const onSelect = (p: Product) => {
    setSelected(p);
    setSuggestions([]);
    setWeight("");
  };

  const onAdd = () => {
    if (!selected) return;
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      alert("Неверный вес");
      return;
    }
    const bu = calculateBreadUnits(w, selected.nutriments.carbohydrates_100g);
    const newItem: Item = {
      id: `${selected.name}-${Date.now()}`,
      product: selected,
      weight: w,
      bu,
    };
    setItems(prev => [...prev, newItem]);
    setSelected(null);
    setWeight("");
  };

  const onRemove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totalBU = items.reduce((sum, i) => sum + i.bu, 0);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Калькулятор ХЕ</h1>

      {/* 1) Поиск */}
      <div className="space-y-2">
        <label className="block font-medium">Название продукта</label>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="йогурт, хлеб..."
          />
          <Button onClick={onSearch} disabled={loading} className="px-3">
            {loading ? "..." : "Поиск"}
          </Button>
        </div>
        {suggestions.length > 0 && (
          <ul className="border rounded max-h-40 overflow-y-auto bg-white">
            {suggestions.map((p, i) => (
              <li
                key={i}
                onClick={() => onSelect(p)}
                className="px-2 py-1 hover:bg-blue-50 cursor-pointer"
              >
                {p.name} — {p.nutriments.carbohydrates_100g} g/100 g
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2) Ввод граммовки и добавление */}
      {selected && (
        <div className="space-y-2 p-4 border rounded bg-gray-50">
          <div>
            <strong>Выбрано:</strong> {selected.name} (
            {selected.nutriments.carbohydrates_100g} g/100 g)
          </div>
          <Input
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="Вес порции, г"
            type="number"
          />
          <Button
            onClick={onAdd}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Добавить
          </Button>
        </div>
      )}

      {/* 3) Список и итог */}
      {items.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Текущие продукты</h2>
          <ul className="space-y-1">
            {items.map(i => (
              <li
                key={i.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  {i.product.name}: {i.weight} г → {i.bu.toFixed(2)} ХЕ
                </div>
                <Button
                  onClick={() => onRemove(i.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold">
            Итого: {totalBU.toFixed(2)} ХЕ
          </div>
        </div>
      )}
    </div>
  );
}
