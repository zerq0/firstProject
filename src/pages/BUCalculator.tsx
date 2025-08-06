import React, { useState } from "react";
import { fetchProductByName, Product } from "../utils/api";
import { calculateBreadUnits } from "../utils/calc";

export default function BUCalculator() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const prods = await fetchProductByName(query);
      setSuggestions(prods.slice(0, 10));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onCalculate = () => {
    if (!selected || !weight) return;
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      alert("Неверный вес");
      return;
    }
    const bu = calculateBreadUnits(w, selected.nutriments.carbohydrates_100g);
    setResult(bu);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Калькулятор ХЕ</h1>

      <div className="space-y-2">
        <label className="block font-medium">Название продукта</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="йогурт, хлеб…"
          />
          <button
            onClick={onSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loading ? "…" : "Поиск"}
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="border rounded max-h-40 overflow-y-auto">
            {suggestions.map((p, i) => (
              <li
                key={i}
                onClick={() => {
                  setSelected(p);
                  setSuggestions([]);
                  setResult(null);
                }}
                className="px-2 py-1 hover:bg-blue-50 cursor-pointer"
              >
                {p.name} — {p.nutriments.carbohydrates_100g} g/100 g
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <>
          <div>
            <strong>Выбрано:</strong> {selected.name} (
            {selected.nutriments.carbohydrates_100g} g/100 g)
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Вес порции, г</label>
            <input
              className="w-full border px-2 py-1 rounded"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="100"
            />
          </div>

          <button
            onClick={onCalculate}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Рассчитать ХЕ
          </button>
        </>
      )}

      {result !== null && (
        <div className="text-center mt-4 text-xl">
          <strong>{result.toFixed(2)}</strong> ХЕ
        </div>
      )}
    </div>
  );
}
