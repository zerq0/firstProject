// src/components/RequireAuth.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    let unsub = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      setReady(true);
    }).data.subscription;

    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });

    return () => { unsub?.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authed) {
      const returnTo = encodeURIComponent(loc.pathname + loc.search);
      navigate(`/login?returnTo=${returnTo}`, { replace: true });
    }
  }, [ready, authed, navigate, loc.pathname, loc.search]);

  if (!ready) return <div className="p-8 text-center">Загружаем…</div>;
  if (!authed) return null;

  return <>{children}</>;
}
