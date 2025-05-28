import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Edit2,  
  Camera,
  Shield,
  BadgeCheck
} from "lucide-react";
import { getUserProfileServer } from "@/lib/auth/roleServer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EditProfileForm, ProfileFormValues } from "./edit-profile-form";
import { toast } from "sonner";

export default async function ProfilePageFixed() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("informasi-pribadi");
  const [previewImage, setPreviewImage] = useState(null);
  const [userData, setUserData] = useState({
    namaLengkap: "",
    email: "",
    nomorTelepon: "",
    alamat: "",
    jabatan: "",
    role: "",
    avatarUrl: "",
  });

  // Inisialisasi supabase untuk SSR
  const supabase = await createServerSupabaseClient();
  
  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Ambil session untuk mendapatkan email user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Gunakan fungsi dari roleServer untuk mendapatkan profil
          const profile = await getUserProfileServer(session.user.id);
            
          if (profile) {
            setUserData({
              namaLengkap: profile.nama,
              email: session.user.email || "",
              nomorTelepon: profile.phone || "",
              alamat: profile.alamat || "",
              jabatan: profile.jabatan,
              role: profile.role,
              avatarUrl: profile.fotoUrl || "",
            });
          }
        }
      } catch (error) {
        toast.error("Gagal memuat data profil");
      }
    }

    loadUserProfile();
  }, []);
  // Add the missing handleImageUpload function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as any);
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

  const handleSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Data yang dikirim:", data);
      toast.success("Profil berhasil diperbarui");
      setIsSubmitting(false);
      setIsEditing(false);
    } catch (error) {
      toast.error("Gagal memperbarui profil");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
        {/* SOLUSI: Menghapus Card dan menggunakan div kustom dengan overflow-hidden */}
        <div className="rounded-lg overflow-hidden border bg-card text-card-foreground">
          {/* SOLUSI: Header yang rapat ke atas dengan menghapus padding default */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-full h-40 relative p-0 m-0">
            <div className="absolute -bottom-16 left-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage src={previewImage || userData.avatarUrl || ""} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(userData.namaLengkap)}
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
            <div className="absolute bottom-4 right-6 flex gap-2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                {userData.jabatan}
              </Badge>
              <Badge className="bg-purple-600 text-white px-3 py-1 text-xs font-medium dark:bg-purple-500">
                {userData.role}
              </Badge>
            </div>
          </div>
          
          <CardHeader className="pt-20 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {userData.namaLengkap}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {userData.email}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profil
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <Tabs
              defaultValue="informasi-pribadi"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="informasi-pribadi" className="text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Informasi Pribadi
                </TabsTrigger>
                <TabsTrigger value="informasi-jabatan" className="text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Informasi Jabatan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="informasi-pribadi" className="mt-6">
                {isEditing ? (
                  <EditProfileForm
                    userData={userData}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Nama Lengkap
                          </h3>
                          <p className="text-base mt-1">{userData.namaLengkap}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Email
                          </h3>
                          <p className="text-base mt-1">{userData.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Nomor Telepon
                          </h3>
                          <p className="text-base mt-1 flex items-center">
                            {userData.nomorTelepon ? (
                              userData.nomorTelepon
                            ) : (
                              <span className="text-muted-foreground italic">
                                Belum diisi
                              </span>
                            )}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Alamat
                          </h3>
                          <p className="text-base mt-1">
                            {userData.alamat ? (
                              userData.alamat
                            ) : (
                              <span className="text-muted-foreground italic">
                                Belum diisi
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="informasi-jabatan" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Jabatan</h3>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">{userData.jabatan}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-medium">Role</h3>
                    </div>
                    <Badge className="bg-purple-600 dark:bg-purple-500 text-white">{userData.role}</Badge>
                  </div>
                  <Separator />
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-6 dark:bg-muted/20">
                    <h4 className="font-medium mb-2">Hak Akses:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                          Dashboard
                        </Badge>
                        <span className="text-sm">Akses penuh</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                          Keuangan
                        </Badge>
                        <span className="text-sm">Akses penuh</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                          Manajemen
                        </Badge>
                        <span className="text-sm">Akses penuh</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                          Konten
                        </Badge>
                        <span className="text-sm">Akses penuh</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                          Inventaris
                        </Badge>
                        <span className="text-sm">Akses penuh</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </div>
    </div>
  );
}