// src/components/admin/layout/profile/edit-profile.tsx
"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  jabatan: string;
  role: string;
  avatarUrl: string;
}

interface EditProfileProps {
  user: SupabaseUser;
  userData: UserProfile;
  onSave: (updatedData: UserProfile) => void;
  onCancel: () => void;
}

export default function EditProfile({
  user,
  userData,
  onSave,
  onCancel,
}: EditProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(userData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from("Profile")
        .update({
          nama: formData.namaLengkap,
          phone: formData.nomorTelepon,
          alamat: formData.alamat,
          fotoUrl: previewImage || formData.avatarUrl,
        })
        .eq("userId", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Gagal menyimpan perubahan");
        return;
      }

      // Update data dengan avatar baru jika ada
      const updatedData = {
        ...formData,
        avatarUrl: previewImage || formData.avatarUrl,
      };

      onSave(updatedData);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setPreviewImage(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage src={previewImage || formData.avatarUrl || ""} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials(formData.namaLengkap)}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <Camera className="h-5 w-5" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <Input
              id="namaLengkap"
              value={formData.namaLengkap}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  namaLengkap: e.target.value,
                }))
              }
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email tidak dapat diubah
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
            <Input
              id="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nomorTelepon: e.target.value,
                }))
              }
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div>
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              value={formData.alamat}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alamat: e.target.value,
                }))
              }
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
