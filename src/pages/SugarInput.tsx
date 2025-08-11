import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ReadingType = "fasting" | "before-meal" | "after-meal" | "bedtime" | "random";
type FilterType = ReadingType | "all";

interface Reading {
  id: string;
  user_id: string;
  glucose: number;
  time: string; // уже в локальном формате
  type: ReadingType;
  notes: string | null;
}

export default function SugarInput() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  const [readings, setReadings] = useState<Reading[]>([]);
  const [glucose, setGlucose] = useState("");
  const [type, setType] = useState<ReadingType | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // Получить текущую сессию и загрузить записи
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id ?? null;
      setSessionUserId(uid);
      if (!uid) return;

      const { data: rows, error } = await supabase
        .from("readings")
        .select("*")
        .eq("user_id", uid)
        .order("time", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const mapped: Reading[] = (rows ?? []).map((r: any) => ({
        id: String(r.id),
        user_id: String(r.user_id),
        glucose: Number(r.glucose),
        time: new Date(r.time).toLocaleString(),
        type: r.type as ReadingType,
        notes: r.notes ?? null,
      }));

      setReadings(mapped);
    });
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return readings;
    return readings.filter((r) => r.type === filter);
  }, [readings, filter]);

  const average = useMemo(() => {
    if (readings.length === 0) return null;
    const sum = readings.reduce((acc, r) => acc + r.glucose, 0);
    return +(sum / readings.length).toFixed(1);
  }, [readings]);

  async function addReading() {
    const v = parseFloat(glucose.replace(",", "."));
    if (!sessionUserId) {
      alert("Не найдена сессия. Войдите заново.");
      return;
    }
    if (isNaN(v) || !type) {
      alert("Введите корректное значение и выберите тип замера.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("readings")
      .insert({
        user_id: sessionUserId,
        glucose: v,
        type,
        notes: notes || null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Не удалось сохранить запись.");
      return;
    }

    const inserted: Reading = {
      id: String(data.id),
      user_id: String(data.user_id),
      glucose: Number(data.glucose),
      time: new Date(data.time).toLocaleString(),
      type: data.type as ReadingType,
      notes: data.notes ?? null,
    };

    setReadings((prev) => [inserted, ...prev]);
    setGlucose("");
    setType(undefined);
    setNotes("");
  }

  async function deleteReading(id: string) {
    const { error } = await supabase.from("readings").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Не удалось удалить.");
      return;
    }
    setReadings((prev) => prev.filter((r) => r.id !== id));
  }

  // если нет сессии — подсказка (на всякий)
  if (!sessionUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Учёт сахара</h1>
          <p>
            Для доступа войдите: <a className="text-blue-600 underline" href="/login">/login</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Учёт сахара в крови</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Форма */}
          <div className="border p-4 rounded-lg bg-white space-y-3">
            <h2 className="font-semibold">Новая запись</h2>

            <Input
              placeholder="Уровень (ммоль/л), напр. 5.6"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
            />

            <Select
              value={type ?? undefined}
              onValueChange={(v) => setType(v as ReadingType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Тип замера" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md">
                <SelectItem value="fasting">Натощак</SelectItem>
                <SelectItem value="before-meal">Перед едой</SelectItem>
                <SelectItem value="after-meal">После еды</SelectItem>
                <SelectItem value="bedtime">Перед сном</SelectItem>
                <SelectItem value="random">В любое время</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Примечания (необязательно)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Button
              onClick={addReading}
              disabled={loading}
              className="w-full bg-blue-600 text-white"
            >
              {loading ? "Сохраняем…" : "Добавить"}
            </Button>
          </div>

          {/* Статистика + фильтр */}
          <div className="border p-4 rounded-lg bg-white space-y-3">
            <h2 className="font-semibold">Статистика</h2>
            <p>
              Всего записей: <strong>{readings.length}</strong>
            </p>
            <p>
              Средний уровень:{" "}
              <strong>{average !== null ? `${average} ммоль/л` : "—"}</strong>
            </p>

            <h3 className="mt-4 font-medium">Фильтр по типу</h3>
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md">
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="fasting">Натощак</SelectItem>
                <SelectItem value="before-meal">Перед едой</SelectItem>
                <SelectItem value="after-meal">После еды</SelectItem>
                <SelectItem value="bedtime">Перед сном</SelectItem>
                <SelectItem value="random">В любое время</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Список */}
          <div className="border p-4 rounded-lg bg-white">
            <h2 className="font-semibold mb-2">Последние записи</h2>

            {filtered.length === 0 ? (
              <div className="text-gray-500">Нет записей.</div>
            ) : (
              <ul className="space-y-2 max-h-[420px] overflow-y-auto">
                {filtered.map((r) => (
                  <li
                    key={r.id}
                    className="flex justify-between items-start bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <div className="font-semibold">
                        {r.glucose} ммоль/л
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatType(r.type)} • {r.time}
                      </div>
                      {r.notes && (
                        <div className="text-xs text-gray-600 mt-1">{r.notes}</div>
                      )}
                    </div>

                    <button
                      onClick={() => deleteReading(r.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatType(t: ReadingType) {
  switch (t) {
    case "fasting":
      return "Натощак";
    case "before-meal":
      return "Перед едой";
    case "after-meal":
      return "После еды";
    case "bedtime":
      return "Перед сном";
    case "random":
      return "В любое время";
  }
}
