import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";      // <-- ../utils, а не ./utils
import { useToast }  from "../hooks/use-toast";          // <-- ../hooks
import { Label }     from "./ui/label";                  // <-- здесь ./, т.к. ui рядом с Auth
import { Input }     from "./ui/input";
import { Button }    from "./ui/button";

export function Auth() {
  const { toast }    = useToast();
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [session, setSession]   = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_, sess) => {
      setSession(!!sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session) return null;

  const handleSendMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    // Будет редиректить на Site URL (https://diabeteasy.vercel.app)
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ссылка отправлена", description: "Проверьте почту." });
    }
  };

  return (
    <div className="... ваш JSX ...">
      {/* форма */}
    </div>
  );
}
