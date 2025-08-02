import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
    });
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Проверьте почту для ссылки входа!");
  };

  if (session) return null; // уже залогинен

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Вход / регистрация</h2>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleSignIn}
        disabled={loading || !email}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Отправляем..." : "Войти по ссылке"}
      </button>
    </div>
  );
}
