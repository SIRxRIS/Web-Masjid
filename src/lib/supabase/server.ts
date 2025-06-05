// src/lib/supabase/server.ts
import {
  createServerClient as _createServerClient,
  type CookieOptions,
} from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const { cookies: getCookies } = await import("next/headers");
  const cookieStore = await getCookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.warn(
              `Supabase server client: Failed to set cookie '${name}'. Error: ${error}`
            );
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            console.warn(
              `Supabase server client: Failed to remove cookie '${name}'. Error: ${error}`
            );
          }
        },
      },
    }
  );
}
