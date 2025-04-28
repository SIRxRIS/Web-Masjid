"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName, 
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/login"); 
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      <Card className="border border-zinc-800 shadow-xl bg-white/80 dark:bg-black backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun baru untuk Masjid Jawahiruzzarqa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" type="button" disabled>
                  {/* nanti kita isi untuk Google login */}
                  Daftar dengan Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-black px-2 text-muted-foreground">
                  Atau daftar dengan email
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Sudah punya akun?{" "}
                <a href="/admin/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Masuk
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
