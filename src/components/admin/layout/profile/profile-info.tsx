// src/components/admin/layout/profile/profile-info.tsx
"use client";

import { User, Mail, Phone, MapPin, Shield, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  jabatan: string;
  role: string;
  avatarUrl: string;
}

interface ProfileInfoProps {
  userData: UserProfile;
}

// Informasi role dan akses sistem
const ROLE_INFO = {
  SUPER_ADMIN: {
    name: "Super Admin",
    description: "Memiliki akses penuh ke seluruh sistem",
    color: "bg-red-600 text-white",
    permissions: [
      "Dashboard - Akses penuh",
      "Keuangan - Read, Write, Delete, Approve",
      "Manajemen - Read, Write, Delete, Approve",
      "Konten - Read, Write, Delete, Approve",
      "Inventaris - Read, Write, Delete, Approve",
      "Admin - Read, Write, Delete, Approve",
    ],
  },
  ADMIN: {
    name: "Admin",
    description: "Memiliki akses administratif ke sebagian besar fitur",
    color: "bg-blue-600 text-white",
    permissions: [
      "Dashboard - Akses penuh",
      "Keuangan - Read, Write, Delete",
      "Manajemen - Read, Write, Delete",
      "Konten - Read, Write, Delete",
      "Inventaris - Read, Write, Delete",
      "Admin - Read, Write",
    ],
  },
  FINANCE: {
    name: "Finance",
    description: "Fokus pada pengelolaan keuangan organisasi",
    color: "bg-green-600 text-white",
    permissions: [
      "Dashboard - Read",
      "Keuangan - Read, Write, Delete, Approve",
      "Manajemen - Read",
      "Konten - Read",
      "Inventaris - Read",
      "Admin - Read",
    ],
  },
  CONTENT: {
    name: "Content",
    description: "Mengelola konten dan publikasi",
    color: "bg-purple-600 text-white",
    permissions: [
      "Dashboard - Read",
      "Keuangan - Read",
      "Manajemen - Read",
      "Konten - Read, Write, Delete, Approve",
      "Inventaris - Read",
      "Admin - Read",
    ],
  },
  MANAGEMENT: {
    name: "Management",
    description: "Mengelola operasional dan manajemen",
    color: "bg-orange-600 text-white",
    permissions: [
      "Dashboard - Read",
      "Keuangan - Read",
      "Manajemen - Read, Write, Delete, Approve",
      "Konten - Read",
      "Inventaris - Read, Write",
      "Admin - Read",
    ],
  },
  INVENTORY: {
    name: "Inventory",
    description: "Mengelola inventaris dan aset",
    color: "bg-teal-600 text-white",
    permissions: [
      "Dashboard - Read",
      "Keuangan - Read",
      "Manajemen - Read",
      "Konten - Read",
      "Inventaris - Read, Write, Delete, Approve",
      "Admin - Read",
    ],
  },
  VIEWER: {
    name: "Viewer",
    description: "Akses hanya untuk melihat informasi",
    color: "bg-gray-600 text-white",
    permissions: [
      "Dashboard - Read",
      "Keuangan - Read",
      "Manajemen - Read",
      "Konten - Read",
      "Inventaris - Read",
      "Admin - Read",
    ],
  },
};

const JABATAN_INFO = {
  DEVELOPER: {
    name: "Developer",
    description: "Mengembangkan dan memelihara sistem",
  },
  MAINTENANCE: {
    name: "Maintenance",
    description: "Pemeliharaan sistem dan infrastruktur",
  },
  PENASEHAT: {
    name: "Penasehat",
    description: "Memberikan nasihat dan konsultasi",
  },
  KETUA: {
    name: "Ketua",
    description: "Memimpin dan mengkoordinasi organisasi",
  },
  SEKRETARIS: {
    name: "Sekretaris",
    description: "Mengelola administrasi dan dokumentasi",
  },
  BENDAHARA: {
    name: "Bendahara",
    description: "Mengelola keuangan organisasi",
  },
  KOORDINATOR: {
    name: "Koordinator",
    description: "Mengkoordinasi kegiatan dan program",
  },
  PENGURUS: {
    name: "Pengurus",
    description: "Membantu operasional organisasi",
  },
};

export default function ProfileInfo({ userData }: ProfileInfoProps) {
  const currentRoleInfo = ROLE_INFO[userData.role as keyof typeof ROLE_INFO];
  const currentJabatanInfo =
    JABATAN_INFO[userData.jabatan as keyof typeof JABATAN_INFO];

  return (
    <div className="space-y-6">
      {/* Informasi Pribadi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Nama Lengkap
              </h3>
              <p className="text-base font-medium">{userData.namaLengkap}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-base font-medium">{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Nomor Telepon
              </h3>
              <p className="text-base font-medium">
                {userData.nomorTelepon || (
                  <span className="text-muted-foreground italic">
                    Belum diisi
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Alamat
              </h3>
              <p className="text-base font-medium">
                {userData.alamat || (
                  <span className="text-muted-foreground italic">
                    Belum diisi
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Jabatan dan Role */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-medium">Jabatan</h3>
              <p className="text-sm text-muted-foreground">
                {currentJabatanInfo?.description || "Posisi dalam organisasi"}
              </p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            {currentJabatanInfo?.name || userData.jabatan}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-medium">Role</h3>
              <p className="text-sm text-muted-foreground">
                {currentRoleInfo?.description || "Hak akses sistem"}
              </p>
            </div>
          </div>
          <Badge
            className={
              currentRoleInfo?.color || "bg-purple-600 text-white px-3 py-1"
            }
          >
            {currentRoleInfo?.name || userData.role}
          </Badge>
        </div>

        {/* Hak Akses Sistem */}
        <div className="bg-muted/50 rounded-lg p-6 dark:bg-muted/20">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hak Akses Sistem - {currentRoleInfo?.name || userData.role}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {currentRoleInfo?.permissions.map((permission, index) => {
              const [module, access] = permission.split(" - ");
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-md bg-background border"
                >
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                  >
                    ✓
                  </Badge>
                  <span className="font-medium">{module}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {access}
                  </span>
                </div>
              );
            }) || (
              <div className="text-center text-muted-foreground py-4">
                Informasi hak akses tidak tersedia
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
