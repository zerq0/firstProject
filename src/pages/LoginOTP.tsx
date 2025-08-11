// src/pages/LoginOTP.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function LoginOTP() {
  const [email, setEmail] = useState('');
  const [code, setCode]   = useState('');
  const [phase, setPhase] = useState<'enter-email'|'enter-code'>('enter-email');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // если уже залогинен — уводим на sugar-input
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/sugar-input', { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function sendCode() {
    if (!email.trim()) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true, // создаем юзера автоматически, если нет
        // emailRedirectTo НЕ НУЖЕН для OTP-кодов
      },
    });
    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }
    setPhase('enter-code');
    setCooldown(60); // задержка на повторную отправку
  }

  async function verifyCode() {
    if (!email.trim() || !code.trim()) return;
    setVerifying(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });
    setVerifying(false);

    if (error) {
      alert(error.message);
      return;
    }
    // успех — есть сессия
    const returnTo = params.get('returnTo') || '/sugar-input';
    navigate(returnTo, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Вход по коду</h1>

        {phase === 'enter-email' && (
          <>
            <label className="text-sm text-gray-600">Почта</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={sendCode}
              disabled={sending || !email.trim() || !!cooldown}
              className="w-full bg-blue-600 text-white"
            >
              {sending ? 'Отправляем…' : cooldown ? `Повторно через ${cooldown}s` : 'Отправить код'}
            </Button>
          </>
        )}

        {phase === 'enter-code' && (
          <>
            <div className="text-sm text-gray-700">
              Мы отправили 6-значный код на <b>{email}</b>
            </div>
            <label className="text-sm text-gray-600">Код из письма</label>
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            <Button
              onClick={verifyCode}
              disabled={verifying || code.length < 6}
              className="w-full bg-blue-600 text-white"
            >
              {verifying ? 'Проверяем…' : 'Войти'}
            </Button>

            <Button
              variant="outline"
              disabled={sending || !!cooldown}
              onClick={sendCode}
              className="w-full"
            >
              {sending ? 'Отправляем…' : cooldown ? `Повторно через ${cooldown}s` : 'Отправить код снова'}
            </Button>

            <Button variant="ghost" className="w-full" onClick={() => setPhase('enter-email')}>
              Изменить почту
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
