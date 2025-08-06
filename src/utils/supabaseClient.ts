// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Эти две переменные вы храните в .env, префикс VITE_ обязательный для Vite
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
