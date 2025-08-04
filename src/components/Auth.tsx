import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export function Auth() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  useEffect(() => {
    // проверяем, залогинен ли пользователь
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    // подписываемся на изменение статуса
    supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
    });
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Проверьте почту — ссылка для входа отправлена!");
  };

  if (session) return null; // если уже залогинен — ничего не рендерим

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Вход по Email</h2>
      <input
        type="email"
        className="w-full border px-3 py-2 rounded"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSignIn}
        disabled={!email || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Отправляем..." : "Войти через почту"}
      </button>
    </div>
  );
}
