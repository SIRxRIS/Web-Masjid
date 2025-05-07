import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, Phone } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    userId: "",
    nama: "Ahmad Shadcn",
    jabatan: "KETUA",
    role: "ADMIN",
    fotoUrl: null,
    phone: null,
    alamat: "Jl. Masjid No. 123, Jakarta Pusat"
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
          <h1 className="text-2xl font-bold">{profile.nama}</h1>
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
                {profile.nama.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
              {profile.fotoUrl && <AvatarImage src={profile.fotoUrl} alt={profile.nama} />}
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
                <Label htmlFor="nama" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                {isEditing ? (
                  <Input 
                    id="nama"
                    name="nama"
                    value={profile.nama}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.nama}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jabatan">
                  Jabatan
                </Label>
                {isEditing ? (
                  <Select
                    value={profile.jabatan}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, jabatan: value }))}
                  >
                    <SelectTrigger id="jabatan" className="w-full">
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENASEHAT">Penasehat</SelectItem>
                      <SelectItem value="KETUA">Ketua</SelectItem>
                      <SelectItem value="SEKRETARIS">Sekretaris</SelectItem>
                      <SelectItem value="BENDAHARA">Bendahara</SelectItem>
                      <SelectItem value="KOORDINATOR">Koordinator</SelectItem>
                      <SelectItem value="PENGURUS">Pengurus</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{profile.jabatan}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role
                </Label>
                {isEditing ? (
                  <Select
                    value={profile.role}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                      <SelectItem value="CONTENT">Content</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                      <SelectItem value="MANAGEMENT">Management</SelectItem>
                      <SelectItem value="INVENTORY">Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{profile.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Nomor Telepon
                </Label>
                {isEditing ? (
                  <Input 
                    id="phone"
                    name="phone"
                    type="number"
                    value={profile.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor telepon"
                  />
                ) : (
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone || "-"}
                  </p>
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