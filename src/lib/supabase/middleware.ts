// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Tambahkan opsi keamanan untuk cookie
          const secureOptions = {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            path: '/',
            ...options
          };
          
          response.cookies.set({
            name,
            value,
            ...secureOptions,
          })
        },
        remove(name, options) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()

  return response
}