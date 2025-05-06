import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, Save } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Ahmad Shadcn",
    jabatan: "Ketua Pengurus",
    periode: "2023-2026",
    alamat: "Jl. Masjid No. 123, Jakarta Pusat",
    fotoUrl: null
  });
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    setIsEditing(false);
  };
  
  return (
    <div className="flex flex-col gap-4 p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detail Profil Pengurus
          </p>
        </div>
        <Button 
          variant="secondary"
          size="sm"
          onClick={toggleEdit}
        >
          {isEditing ? (
            <Save className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Simpan" : "Edit"}
        </Button>
      </div>
      
      <Separator />
      
      <div className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-40 h-40 rounded-xl">
              <AvatarFallback className="text-5xl">
                {profile.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
              {profile.fotoUrl && <AvatarImage src={profile.fotoUrl} alt={profile.name} />}
            </Avatar>
            {isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Ganti Foto
              </Button>
            )}
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                {isEditing ? (
                  <Input 
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jabatan">
                  Jabatan
                </Label>
                {isEditing ? (
                  <Input 
                    id="jabatan"
                    name="jabatan"
                    value={profile.jabatan}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-lg">{profile.jabatan}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periode">
                  Periode
                </Label>
                {isEditing ? (
                  <Input 
                    id="periode"
                    name="periode"
                    value={profile.periode}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-lg">{profile.periode}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alamat">
                  Alamat
                </Label>
                {isEditing ? (
                  <Input 
                    id="alamat"
                    name="alamat"
                    value={profile.alamat || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-lg">{profile.alamat || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
            className="px-4"
          >
            Batal
          </Button>
          <Button 
            onClick={handleSave}
            className="px-4"
          >
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}