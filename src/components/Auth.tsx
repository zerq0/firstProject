// src/components/Auth.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";

type Mode = "signin" | "signup" | "reset";

export function Auth() {
  const { toast } = useToast();
  const [mode, setMode]   = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    supabase.auth.onAuthStateChange((_e, s) => {
      setSession(!!s);
    });
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка регистрации", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Проверьте почту", description: "Ссылка для подтверждения отправлена." });
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка входа", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Успешно", description: "Вы авторизованы." });
    }
  };

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка сброса", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Письмо отправлено", description: "Проверьте почту для сброса пароля." });
    }
  };

  if (session) return null;

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow space-y-4">
      <div className="flex justify-center gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${mode==="signin"?"bg-blue-600 text-white":"text-blue-600 hover:bg-blue-50"}`}
          onClick={() => setMode("signin")}
        >Войти</button>
        <button
          className={`px-3 py-1 rounded ${mode==="signup"?"bg-blue-600 text-white":"text-blue-600 hover:bg-blue-50"}`}
          onClick={() => setMode("signup")}
        >Регистрация</button>
        <button
          className={`px-3 py-1 rounded ${mode==="reset"?"bg-blue-600 text-white":"text-blue-600 hover:bg-blue-50"}`}
          onClick={() => setMode("reset")}
        >Сброс</button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {mode !== "reset" && (
          <div>
            <Label htmlFor="pass">Пароль</Label>
            <Input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        )}

        {mode === "signin" && (
          <Button
            onClick={handleSignIn}
            disabled={loading || !email || !pass}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Вхожу..." : "Войти"}
          </Button>
        )}

        {mode === "signup" && (
          <Button
            onClick={handleSignUp}
            disabled={loading || !email || !pass}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Регистрирую..." : "Зарегистрироваться"}
          </Button>
        )}

        {mode === "reset" && (
          <Button
            onClick={handleReset}
            disabled={loading || !email}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {loading ? "Отправляем..." : "Сбросить пароль"}
          </Button>
        )}
      </div>
    </div>
  );
}
