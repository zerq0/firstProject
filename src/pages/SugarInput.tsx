import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpButton } from "@/components/Help";
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
  time: string;
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
    const base = filter === "all" ? readings : filtered;
    if (base.length === 0) return null;
    const sum = base.reduce((acc, r) => acc + r.glucose, 0);
    return +(sum / base.length).toFixed(1);
  }, [readings, filtered, filter]);

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

  if (!sessionUserId) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto panel p-6">
          <h1 className="text-2xl font-bold mb-4 text-violet-900">Учёт сахара</h1>
          <p>
            Для доступа войдите: <a className="link-primary" href="/login">/login</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-violet-900">Учёт сахара в крови</h1>
          <HelpButton title="Как вести учёт сахара?">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Введите значение в ммоль/л (можно с запятой, например 5,6).</li>
              <li>Выберите тип замера: натощак, перед/после еды, перед сном, любое время.</li>
              <li>Нажмите «Добавить» — запись появится в списке справа.</li>
              <li>Используйте фильтр, чтобы видеть среднее именно по выбранному типу.</li>
            </ol>
          </HelpButton>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Форма */}
          <div className="panel p-4 space-y-3">
            <h2 className="font-semibold text-violet-900">Новая запись</h2>

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

            <Button onClick={addReading} disabled={loading} className="w-full btn-primary">
              {loading ? "Сохраняем…" : "Добавить"}
            </Button>
          </div>

          {/* Статистика */}
          <div className="panel p-4 space-y-3">
            <h2 className="font-semibold text-violet-900">Статистика</h2>

            <p>
              Всего записей:{" "}
              <strong>{filter === "all" ? readings.length : filtered.length}</strong>
              {filter !== "all" && (
                <span className="text-sm text-slate-500"> (по фильтру)</span>
              )}
            </p>

            <p>
              Средний уровень:{" "}
              <strong>{average !== null ? `${average} ммоль/л` : "—"}</strong>
              {filter !== "all" && (
                <span className="text-sm text-slate-500">
                  {" "}— только «{formatFilterLabel(filter)}»
                </span>
              )}
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
          <div className="panel p-4">
            <h2 className="font-semibold mb-2 text-violet-900">Последние записи</h2>
            {filtered.length === 0 ? (
              <div className="text-slate-500">Нет записей.</div>
            ) : (
              <ul className="space-y-2 max-h-[420px] overflow-y-auto">
                {filtered.map((r) => (
                  <li key={r.id} className="flex justify-between items-start bg-violet-50/60 p-2 rounded">
                    <div>
                      <div className="font-semibold text-violet-900">{r.glucose} ммоль/л</div>
                      <div className="text-sm text-slate-600">
                        {formatType(r.type)} • {r.time}
                      </div>
                      {r.notes && <div className="text-xs text-slate-600 mt-1">{r.notes}</div>}
                    </div>
                    <button
                      onClick={() => deleteReading(r.id)}
                      className="text-rose-600 hover:underline text-sm"
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
    case "fasting": return "Натощак";
    case "before-meal": return "Перед едой";
    case "after-meal": return "После еды";
    case "bedtime": return "Перед сном";
    case "random": return "В любое время";
  }
}

function formatFilterLabel(t: FilterType) {
  if (t === "all") return "Все";
  return formatType(t as ReadingType);
}
