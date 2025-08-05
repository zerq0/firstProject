// src/components/Auth.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button } from "./ui/button";
import { Input }  from "./ui/input";
import { Label }  from "./ui/label";
import { useToast } from "../hooks/use-toast";

export function Auth() {
  const { toast } = useToast();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  useEffect(() => {
    // сразу подхватываем сессию, если она уже в localStorage
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    // и подписываемся на будущие события залогина
    supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
    });
  }, []);

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    setLoading(false);
    await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: window.location.origin }
});

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ссылка отправлена", description: "Проверьте почту и кликните по magic-link." });
    }
  };

  // если уже залогинен — не показываем форму
  if (session) return null;

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Войти через magic link</h2>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button
        onClick={handleMagicLink}
        disabled={loading || !email}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "Отправляем..." : "Получить ссылку"}
      </Button>
    </div>
  );
}
