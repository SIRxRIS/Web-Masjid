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
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { createClient } from "@/lib/supabase/client";
import { PengeluaranData } from "../schema";
import { formatNumber, unformatNumber } from "../utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditPengeluaranProps {
  isOpen: boolean;
  onClose: () => void;
  data: PengeluaranData | null;
  onSave: (updatedData: PengeluaranData) => void;
  onDelete: (id: number) => void;
  year: string;
}

export function EditPengeluaran({
  isOpen,
  onClose,
  data,
  onSave,
  onDelete,
  year,
}: EditPengeluaranProps) {
  const [formData, setFormData] = React.useState<PengeluaranData | null>(null);

  React.useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        tanggal:
          data.tanggal instanceof Date ? data.tanggal : new Date(data.tanggal),
      });
    }
  }, [data]);

  if (!formData) return null;

  const handleInputChange = (field: string, value: string | number | Date) => {
    setFormData((prev) => {
      if (!prev) return null;

      if (field === "nama" || field === "keterangan") {
        return { ...prev, [field]: value as string };
      } else if (field === "tanggal") {
        return { ...prev, [field]: value as Date };
      } else {
        const numValue =
          typeof value === "string" ? unformatNumber(value) : value;
        return { ...prev, [field]: numValue };
      }
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleInputChange("tanggal", date);
    }
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("Pengeluaran")
          .update({
            nama: formData.nama,
            tanggal:
              formData.tanggal instanceof Date
                ? format(formData.tanggal, "yyyy-MM-dd")
                : formData.tanggal,
            jumlah: formData.jumlah,
            keterangan: formData.keterangan,
          })
          .eq("id", formData.id);

        if (error) {
          console.error("Error updating pengeluaran:", error);
          Swal.fire({
            title: "Error!",
            text: "Gagal memperbarui data pengeluaran",
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
          text: "Data pengeluaran berhasil diperbarui",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Pengeluaran</DialogTitle>
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
                      format(new Date(formData.tanggal), "dd MMMM yyyy", {
                        locale: id,
                      })
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
                    locale={id}
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
              type="text"
              value={formatNumber(formData.jumlah.toString())}
              onChange={(e) => handleInputChange("jumlah", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keterangan" className="text-right">
              Keterangan
            </Label>
            <Textarea
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
