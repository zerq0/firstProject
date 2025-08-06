// src/pages/SugarInput.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';

interface Reading {
  id: string;
  user_id: string;
  glucose: number;
  time: string;
  type: 'fasting' | 'before-meal' | 'after-meal' | 'bedtime' | 'random';
  notes: string;
}

export default function SugarInput() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [glucose, setGlucose]   = useState('');
  const [type, setType]         = useState<Reading['type'] | ''>('');
  const [notes, setNotes]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState<'all' | Reading['type']>('all');

  // 1) Загрузка
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from<Reading, Reading>('readings')
        .select('*')
        .eq('user_id', userId)
        .order('time', { ascending: false });

      if (error) {
        console.error('Ошибка загрузки:', error);
      } else if (data) {
        setReadings(
          data.map((r) => ({
            ...r,
            time: new Date(r.time).toLocaleString(),
          }))
        );
      }
    })();
  }, []);

  // 2) Добавление
  const addReading = async () => {
    const val = parseFloat(glucose.replace(',', '.'));
    if (isNaN(val) || !type) {
      alert('Введите уровень и выберите тип.');
      return;
    }
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      setLoading(false);
      alert('Сессия недоступна.');
      return;
    }

    const { data, error } = await supabase
      .from<Reading, Reading>('readings')
      .insert({ user_id: userId, glucose: val, type, notes })
      .select()
      .single();

    setLoading(false);
    if (error) {
      console.error('Ошибка добавления:', error);
      alert('Не удалось сохранить.');
    } else if (data) {
      setReadings((prev) => [
        { ...data, time: new Date(data.time).toLocaleString() },
        ...prev,
      ]);
      setGlucose('');
      setType('');
      setNotes('');
    }
  };

  // 3) Удаление
  const deleteReading = async (id: string) => {
    const { error } = await supabase
      .from<Reading, Reading>('readings')
      .delete()
      .eq('id', id);
    if (error) console.error('Ошибка удаления:', error);
    else setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  // Фильтрация
  const filtered = filter === 'all'
    ? readings
    : readings.filter((r) => r.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Учёт сахара в крови
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Форма */}
        <div className="border p-4 rounded bg-white space-y-3">
          <h2 className="font-semibold">Новая запись</h2>
          <Input
            placeholder="Уровень (ммоль/л), напр. 5.6"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
          />
          <Select value={type || 'all'} onValueChange={(v) => setType(v as Reading['type'])}>
            <SelectTrigger><SelectValue placeholder="Тип замера" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fasting">Натощак</SelectItem>
              <SelectItem value="before-meal">Перед едой</SelectItem>
              <SelectItem value="after-meal">После еды</SelectItem>
              <SelectItem value="bedtime">Перед сном</SelectItem>
              <SelectItem value="random">В любое время</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Примечания (опционально)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            onClick={addReading}
            disabled={loading}
            className="w-full bg-blue-600 text-white"
          >
            {loading ? 'Сохраняем...' : 'Добавить'}
          </Button>
        </div>

        {/* Статистика + фильтр */}
        <div className="border p-4 rounded bg-white space-y-3">
          <h2 className="font-semibold">Статистика</h2>
          <p>
            Всего записей: <strong>{readings.length}</strong>
          </p>
          <p>
            Среднее:{' '}
            <strong>
              {readings.length
                ? (readings.reduce((s, r) => s + r.glucose, 0) / readings.length).toFixed(1)
                : '—'}
              {' '}ммоль/л
            </strong>
          </p>
          <h3 className="mt-4 font-medium">Фильтр по типу</h3>
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger><SelectValue placeholder="Все типы" /></SelectTrigger>
            <SelectContent>
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
        <div className="border p-4 rounded bg-white max-h-[400px] overflow-y-auto">
          <h2 className="font-semibold mb-2">Последние записи</h2>
          {filtered.length === 0 ? (
            <p className="text-gray-500">Нет записей.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-start bg-gray-50 p-2 rounded"
                >
                  <div>
                    <p>
                      <strong>{r.glucose}</strong> ммоль/л • {r.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      {r.type} {r.notes && `• ${r.notes}`}
                    </p>
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
  );
}
