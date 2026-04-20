import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use valid placeholder Supabase URL format if not available
// This allows the build to succeed; actual URL will be used at runtime
const url = supabaseUrl || "https://placeholder-project.supabase.co";
const key = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(url, key);

// Runtime validation
export function validateSupabaseConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }
}
