import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpButton } from "@/components/Help";
import { Mail, Shield, Sparkles, ArrowLeft } from "lucide-react";

type Phase = "enter-email" | "enter-code";

export default function LoginOTP() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("enter-email");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  // OTP как массив из 6 символов
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Уже залогинен? — отправляем на /sugar-input
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/sugar-input", { replace: true });
    });
  }, [navigate]);

  // Тикер для cooldown
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const otpString = useMemo(() => otp.join(""), [otp]);

  async function sendCode() {
    setErrorMsg(null);
    const targetEmail = email.trim();
    if (!targetEmail) return;

    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: { shouldCreateUser: true },
    });
    setSending(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setPhase("enter-code");
    setCooldown(60);
    // автофокус на первый пин-инпут
    setTimeout(() => inputsRef.current[0]?.focus(), 10);
  }

  async function verifyCode() {
    setErrorMsg(null);
    const code = otpString.trim();
    if (!email.trim() || code.length < 6) return;

    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: "email",
    });
    setVerifying(false);

    if (error) {
      setErrorMsg(error.message);
      // подчистить код для повторного ввода
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      return;
    }
    const returnTo = params.get("returnTo") || "/sugar-input";
    navigate(returnTo, { replace: true });
  }

  function handleOtpChange(idx: number, value: string) {
    // разрешаем только цифры, берём первый символ
    const v = value.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[idx] = v;
    setOtp(next);

    if (v && idx < 5) inputsRef.current[idx + 1]?.focus();
    if (!v && idx > 0) {
      // если стёрли — оставляем фокус как есть
    }
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "Enter") {
      if (phase === "enter-email") sendCode();
      else verifyCode();
    }
  }

  function resetToEmail() {
    setPhase("enter-email");
    setOtp(["", "", "", "", "", ""]);
    setErrorMsg(null);
    setCooldown(0);
    setTimeout(() => {
      const el = document.getElementById("email-input") as HTMLInputElement | null;
      el?.focus();
    }, 10);
  }

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-10">
      {/* фоновые блобы */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-rose-300/40 blur-3xl" />
        <div className="absolute top-12 -right-10 h-80 w-80 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Хиро */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Без паролей — безопасный вход по коду
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-violet-900">
            Вход по коду
          </h1>
          <p className="mt-2 text-violet-700">
            Мы отправим 6-значный код на вашу почту. Введите его — и вы в системе.
          </p>
        </div>

        {/* Карточка формы */}
        <div className="panel max-w-xl mx-auto p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-600" />
              <div className="text-sm text-slate-600">
                Надёжно: OTP действует ограниченное время.
              </div>
            </div>
            <HelpButton title="Как войти по коду?">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Введите ваш email и нажмите «Отправить код».</li>
                <li>Проверьте входящие/спам — придёт письмо с 6-значным кодом.</li>
                <li>Введите код в ячейки и нажмите «Войти».</li>
                <li>Если письмо не пришло — подождите минутку и нажмите «Отправить снова».</li>
              </ol>
            </HelpButton>
          </div>

          {/* Индикатор шага */}
          <div className="mb-6 flex items-center gap-2 text-xs">
            <StepDot active={phase === "enter-email"}>Почта</StepDot>
            <div className="h-px flex-1 bg-indigo-100" />
            <StepDot active={phase === "enter-code"}>Код</StepDot>
          </div>

          {phase === "enter-email" && (
            <div className="space-y-4">
              <label htmlFor="email-input" className="text-sm text-slate-700">Почта</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={sendCode}
                  disabled={sending || !email.trim() || !!cooldown}
                  className="btn-primary whitespace-nowrap"
                >
                  {sending ? "Отправляем…" : cooldown ? `Повторно через ${cooldown}s` : "Отправить код"}
                </Button>
              </div>

              {errorMsg && (
                <div className="text-sm text-rose-600">
                  {errorMsg}
                </div>
              )}
            </div>
          )}

          {phase === "enter-code" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                Код отправлен на <span className="font-semibold text-violet-900">{email}</span>
              </div>

              {/* ПИН-ИНПУТ (6 ячеек) */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="otp-cell"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button
                  className="btn-primary flex-1"
                  onClick={verifyCode}
                  disabled={verifying || otpString.length < 6}
                >
                  {verifying ? "Проверяем…" : "Войти"}
                </Button>

                <Button
                  variant="outline"
                  onClick={sendCode}
                  disabled={sending || !!cooldown}
                >
                  {sending ? "Отправляем…" : cooldown ? `Снова через ${cooldown}s` : "Отправить снова"}
                </Button>

                <Button variant="ghost" onClick={resetToEmail} className="inline-flex gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Изменить почту
                </Button>
              </div>

              {errorMsg && (
                <div className="text-sm text-rose-600">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Небольшой FAQ/подсказка */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Письма нет? Проверьте спам. Для стабильной доставки лучше подключить свой SMTP (SendGrid/Mailgun/Postmark).
        </div>
      </div>
    </div>
  );
}

function StepDot({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "inline-block h-2.5 w-2.5 rounded-full",
          active ? "bg-violet-600" : "bg-indigo-200",
        ].join(" ")}
      />
      <span className={active ? "text-violet-900 font-medium" : "text-slate-500"}>
        {children}
      </span>
    </div>
  );
}
