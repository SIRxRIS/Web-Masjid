// src/app/admin/unauthorized/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/AppLogo";
import { ShieldX, Home } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              Akses Ditolak
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Email Anda tidak terdaftar dalam sistem
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Hanya email yang terdaftar dalam whitelist yang dapat mengakses sistem admin.</p>
            <p className="mt-2">Silakan hubungi administrator untuk mendapatkan akses.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link href="/admin/login">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t">
            <AppLogo className="justify-center" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}