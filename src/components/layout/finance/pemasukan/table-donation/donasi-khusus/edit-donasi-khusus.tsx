"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DonasiKhususData } from "../schema";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { id } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditDonasiKhususProps {
  isOpen: boolean;
  onClose: () => void;
  donasi: DonasiKhususData | null;
  onSave: (updatedDonasi: DonasiKhususData) => void;
}

export function EditDonasiKhusus({
  isOpen,
  onClose,
  donasi,
  onSave,
}: EditDonasiKhususProps) {
  const [formData, setFormData] = React.useState<DonasiKhususData | null>(null);

  React.useEffect(() => {
    if (donasi) {
      setFormData({ ...donasi });
    }
  }, [donasi]);

  if (!formData) return null;

  const handleInputChange = (field: string, value: string | number | Date) => {
    setFormData((prev) => {
      if (!prev) return null;

      if (field === "nama" || field === "keterangan") {
        return { ...prev, [field]: value as string };
      } else if (field === "tanggal") {
        return { ...prev, [field]: new Date(value) };
      } else {
        const numValue =
          typeof value === "string" ? parseFloat(value) || 0 : value;
        return { ...prev, [field]: numValue };
      }
    });
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const { error } = await supabase
          .from("DonasiKhusus")
          .update({
            nama: formData.nama,
            tanggal: formData.tanggal,
            jumlah: formData.jumlah,
            keterangan: formData.keterangan,
          })
          .eq("id", formData.id);

        if (error) {
          console.error("Error updating donasi:", error);
          Swal.fire({
            title: "Error!",
            text: "Gagal memperbarui data donasi",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
        onSave(formData);
        Swal.fire({
          title: "Berhasil!",
          text: "Data donasi berhasil diperbarui",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        onClose();
      } catch (err) {
        console.error("Error in handleSave:", err);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat memperbarui data",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleInputChange("tanggal", date);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Donasi Khusus</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Nama
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal" className="text-right">
              Tanggal
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="tanggal"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.tanggal && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.tanggal ? (
                      format(new Date(formData.tanggal), "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.tanggal)}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jumlah" className="text-right">
              Jumlah
            </Label>
            <Input
              id="jumlah"
              type="number"
              value={formData.jumlah}
              onChange={(e) => handleInputChange("jumlah", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keterangan" className="text-right">
              Keterangan
            </Label>
            <Input
              id="keterangan"
              value={formData.keterangan}
              onChange={(e) => handleInputChange("keterangan", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}