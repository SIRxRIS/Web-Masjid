// src/components/admin/layout/login/LoginForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { AppLogo } from "@/components/shared/AppLogo";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle error dari URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clear error dari URL tanpa reload
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error?.message || "Terjadi kesalahan saat login");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/95 dark:bg-black/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <AppLogo showText={false} className="scale-150 mb-2" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription className="mt-2 text-base">
            Masuk ke sistem admin Masjid Jawahiruzzarqa
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Box */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <span className="font-medium">Akses Terbatas:</span> Hanya email yang terdaftar dalam whitelist yang dapat mengakses sistem ini.
          </AlertDescription>
        </Alert>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 group"
          variant="outline"
        >
          <div className="flex items-center justify-center">
            {!isLoading && (
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
            )}
            <span className="text-white group-hover:font-semibold transition-all duration-200">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                  Memproses...
                </>
              ) : (
                "Masuk dengan Google"
              )}
            </span>
          </div>
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Sistem Manajemen Internal</p>
          <p className="font-medium">Masjid Jawahiruzzarqa</p>
        </div>
      </CardContent>
    </Card>
  );
}