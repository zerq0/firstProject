// src/pages/SugarInput.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Auth } from "../components/Auth";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { TrendingUp, Plus, Trash2 } from "lucide-react";

interface Reading {
  id: string;
  user_id: string;
  glucose: number;
  time: string;
  type: string;
  notes: string;
}

const SugarInput: React.FC = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [filter, setFilter] = useState<string>("");

  const [glucose, setGlucose] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");

  // 1) Проверяем сессию и подписываемся на её изменения
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
    });
  }, []);

  // 2) Загружаем записи сразу после логина
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .order("time", { ascending: false });
      if (error) {
        toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
      } else {
        setReadings(data as Reading[]);
      }
    })();
  }, [session]);

  // Фильтруем записи
  const displayed = filter
    ? readings.filter((r) => r.type === filter)
    : readings;

  // 3) Добавляем новую запись
  const addReading = async () => {
    const mmol = parseFloat(glucose);
    if (isNaN(mmol) || mmol <= 0 || !type) {
      toast({ title: "Неверный ввод", description: "Проверьте уровень и тип замера.", variant: "destructive" });
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({ title: "Неавторизован", variant: "destructive" });
      return;
    }
    const newR = {
      user_id: userData.user.id,
      glucose: mmol,
      time: new Date().toISOString(),
      type,
      notes,
    };
    const { error } = await supabase.from("readings").insert(newR);
    if (error) {
      toast({ title: "Ошибка сохранения", description: error.message, variant: "destructive" });
    } else {
      // Предположим, что Supabase вернул нам новые данные, но чтобы сразу отобразить:
      setReadings((prev) => [
        { ...newR, id: Date.now().toString() },
        ...prev,
      ]);
      setGlucose("");
      setType("");
      setNotes("");
      toast({ title: "Сохранено", description: `${mmol} ммоль/л добавлено` });
    }
  };

  // 4) Удаляем запись
  const deleteReading = async (id: string) => {
    const { error } = await supabase.from("readings").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    } else {
      setReadings((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Запись удалена" });
    }
  };

  // Если не залогинен — показываем форму magic-link
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Auth />
      </div>
    );
  }

  // Основной интерфейс
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Заголовок и фильтр */}
        <div className="text-center space-y-2">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto" />
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-900">
            Учёт сахара в крови
          </h1>
          <div className="flex justify-center items-center gap-2">
            <Label>Показать:</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="">Все</SelectItem>
                <SelectItem value="fasting">Натощак</SelectItem>
                <SelectItem value="before-meal">Перед едой</SelectItem>
                <SelectItem value="after-meal">После еды</SelectItem>
                <SelectItem value="bedtime">Перед сном</SelectItem>
                <SelectItem value="random">Произвольно</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Форма добавления */}
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <CardTitle>Новая запись</CardTitle>
            <CardDescription>Добавьте текущий уровень (ммоль/л)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="glucose">Уровень</Label>
              <Input
                id="glucose"
                type="number"
                placeholder="5.6"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Тип замера</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="fasting">Натощак</SelectItem>
                  <SelectItem value="before-meal">Перед едой</SelectItem>
                  <SelectItem value="after-meal">После еды</SelectItem>
                  <SelectItem value="bedtime">Перед сном</SelectItem>
                  <SelectItem value="random">Произвольно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Примечания</Label>
              <Input
                id="notes"
                placeholder="Комментарий (необязательно)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              onClick={addReading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Сохранить
            </Button>
          </CardContent>
        </Card>

        {/* Список записей */}
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <CardTitle>Последние записи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {displayed.length === 0 ? (
              <div className="text-center text-gray-500">Нет записей</div>
            ) : (
              displayed.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <div className="font-bold">{r.glucose} ммоль/л</div>
                    <div className="text-sm text-gray-600">
                      {new Date(r.time).toLocaleString()}
                    </div>
                    {r.notes && (
                      <div className="text-sm text-gray-700 mt-1">{r.notes}</div>
                    )}
                  </div>
                  <Button
                    onClick={() => deleteReading(r.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SugarInput;
