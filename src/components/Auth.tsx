// src/components/Auth.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useToast } from "../hooks/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Auth() {
  const { toast } = useToast();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  useEffect(() => {
    // проверяем, есть ли текущая сессия
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    // подписка на изменения авторизации
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSendMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    const redirectTo = window.location.origin + "/sugar-input";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ссылка отправлена", description: "Проверьте почту и кликните по magic-link." });
    }
  };

  // скрываем форму, если уже залогинен
  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center">Вход по magic-link</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSendMagicLink}
          disabled={loading || !email}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Отправляем..." : "Получить ссылку"}
        </Button>
      </div>
    </div>
  );
}
