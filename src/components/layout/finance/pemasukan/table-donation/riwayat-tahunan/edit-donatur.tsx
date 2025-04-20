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
import { DonaturData } from "@/components/layout/finance/pemasukan/table-donation/schema";
import Swal from "sweetalert2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";

interface MonthName {
  field: string;
  label: string;
}

const monthNames: MonthName[] = [
  { field: "jan", label: "Januari" },
  { field: "feb", label: "Februari" },
  { field: "mar", label: "Maret" },
  { field: "apr", label: "April" },
  { field: "mei", label: "Mei" },
  { field: "jun", label: "Juni" },
  { field: "jul", label: "Juli" },
  { field: "aug", label: "Agustus" },
  { field: "sep", label: "September" },
  { field: "okt", label: "Oktober" },
  { field: "nov", label: "November" },
  { field: "des", label: "Desember" },
];

interface EditDonaturProps {
  isOpen: boolean;
  onClose: () => void;
  donatur: DonaturData | null;
  onSave: (updatedDonatur: DonaturData) => void;
  onDelete: (id: number) => void;
}

export function EditDonatur({
  isOpen,
  onClose,
  donatur,
  onSave,
  onDelete,
}: EditDonaturProps) {
  const [formData, setFormData] = React.useState<DonaturData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (donatur) {
      setFormData({ ...donatur });
    }
  }, [donatur]);

  if (!formData) return null;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return null;

      if (field === "nama" || field === "alamat") {
        return { ...prev, [field]: value as string };
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
          .from("Donatur")
          .update({
            nama: formData.nama,
            alamat: formData.alamat,
            jan: formData.jan,
            feb: formData.feb,
            mar: formData.mar,
            apr: formData.apr,
            mei: formData.mei,
            jun: formData.jun,
            jul: formData.jul,
            aug: formData.aug,
            sep: formData.sep,
            okt: formData.okt,
            nov: formData.nov,
            des: formData.des,
            infaq: formData.infaq,
          })
          .eq("id", formData.id);

        if (error) {
          console.error("Error updating donatur:", error);
          Swal.fire({
            title: "Error!",
            text: "Gagal memperbarui data donatur",
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
          text: "Data donatur berhasil diperbarui",
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

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    if (donatur) {
      onDelete(donatur.id);
      Swal.fire({
        title: "Terhapus!",
        text: "Data donatur berhasil dihapus",
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Data Donatur
            </DialogTitle>
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
              <Label htmlFor="alamat" className="text-right">
                Alamat
              </Label>
              <Input
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleInputChange("alamat", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Donasi Bulanan</h3>
              <div className="grid grid-cols-2 gap-4">
                {monthNames.map(({ field, label }) => (
                  <div
                    key={field}
                    className="grid grid-cols-3 items-center gap-2"
                  >
                    <Label htmlFor={field} className="col-span-1">
                      {label}
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      value={formData[field as keyof DonaturData] as number}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label htmlFor="infaq" className="text-right font-semibold">
                Infaq
              </Label>
              <Input
                id="infaq"
                type="number"
                value={formData.infaq}
                onChange={(e) => handleInputChange("infaq", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          {/* Changed from justify-between */}
          <DialogFooter className="flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button className="text-white" onClick={handleSave}>
                Simpan Perubahan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </>
  );
}
