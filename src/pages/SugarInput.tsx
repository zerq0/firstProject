// src/pages/SugarInput.tsx
import React, { useState, useEffect } from "react";
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
import { useToast } from "../hooks/use-toast";

interface Reading {
  id: string;
  glucose: number;  // уже в ммоль/л
  time: string;
  type: string;
  notes: string;
}

export default function SugarInput() {
  // 1) Загружаем из localStorage
  const [readings, setReadings] = useState<Reading[]>(() => {
    const saved = localStorage.getItem("sugarReadings");
    return saved ? JSON.parse(saved) : [];
  });

  const [glucose, setGlucose] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // 2) Сохраняем в localStorage при каждом изменении readings
  useEffect(() => {
    localStorage.setItem("sugarReadings", JSON.stringify(readings));
  }, [readings]);

  // Функция для расчёта среднего
  const avgMmol =
    readings.length > 0
      ? Math.round(
          (readings.reduce((sum, r) => sum + r.glucose, 0) / readings.length) *
            10
        ) / 10
      : 0;

  const addReading = () => {
    const mmol = parseFloat(glucose);
    if (isNaN(mmol) || mmol <= 0 || !type) {
      toast({
        title: "Ошибка ввода",
        description: "Введите корректный уровень глюкозы и выберите тип замера.",
        variant: "destructive",
      });
      return;
    }
    const newR: Reading = {
      id: Date.now().toString(),
      glucose: mmol,
      time: new Date().toLocaleString(),
      type,
      notes,
    };
    setReadings([newR, ...readings]);
    setGlucose("");
    setType("");
    setNotes("");
    toast({
      title: "Запись добавлена",
      description: `Уровень ${mmol} ммоль/л сохранён.`,
    });
  };

  const deleteReading = (id: string) => {
    setReadings((r) => r.filter((x) => x.id !== id));
    toast({ title: "Запись удалена" });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-12 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
      <div className="max-w-xl sm:max-w-4xl lg:max-w-6xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-2">
            Учёт сахара в крови
          </h1>
          <p className="text-base sm:text-lg text-blue-700">
            Записывайте и отслеживайте уровень глюкозы в ммоль/л.
          </p>
        </div>

        {/* Сетка */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Форма добавления */}
          <Card className="p-4 sm:p-6">
            <CardHeader>
              <CardTitle>Новая запись</CardTitle>
              <CardDescription>Введите текущий уровень</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="glucose">Уровень (ммоль/л)</Label>
                <Input
                  id="glucose"
                  type="number"
                  placeholder="Например, 5.6"
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
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                  placeholder="Дополнительная информация"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                onClick={addReading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card className="p-4 sm:p-6 border-green-200">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="text-2xl font-bold text-green-900">
                {avgMmol} ммоль/л
              </div>
              <div>Средний уровень</div>
              <div className="text-2xl font-bold text-blue-900">
                {readings.length}
              </div>
              <div>Всего записей</div>
            </CardContent>
          </Card>

          {/* Последние записи */}
          <Card className="p-4 sm:p-6">
            <CardHeader>
              <CardTitle>Последние записи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {readings.length === 0 && (
                <div className="text-center text-gray-500">Нет записей.</div>
              )}
              {readings.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <div className="font-bold">{r.glucose} ммоль/л</div>
                    <div className="text-sm text-gray-600">{r.time}</div>
                    {r.notes && (
                      <div className="text-sm text-gray-700 mt-1">
                        {r.notes}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => deleteReading(r.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
