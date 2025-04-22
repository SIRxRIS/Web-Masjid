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
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import { type IntegratedData } from "@/lib/services/data-integration";
import { formatNumber, unformatNumber } from "../../../pemasukan/table-donation/utils";

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
  data: IntegratedData | null;
  onSave: (updatedData: IntegratedData) => void;
  onDelete: (id: number) => void;
  year: string;
}

export function EditDonatur({
  isOpen,
  onClose,
  data,
  onSave,
  onDelete,
  year,
}: EditDonaturProps) {
  const [formData, setFormData] = React.useState<IntegratedData | null>(null);
  React.useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    if (!formData) return;
  
    const processedValue = field === 'nama' || field === 'alamat' 
      ? value 
      : unformatNumber(value);
  
    setFormData({
      ...formData,
      [field]: processedValue,
      total: calculateTotal({
        ...formData,
        [field]: processedValue
      })
    });
  };
  
  const calculateTotal = (data: IntegratedData) => {
    return data.jan + data.feb + data.mar + data.apr + 
           data.mei + data.jun + data.jul + data.aug + 
           data.sep + data.okt + data.nov + data.des + 
           data.infaq;
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const { error } = await supabase
          .from(formData.sourceType === 'donatur' ? "Donatur" : 
                formData.sourceType === 'kotakAmal' ? "KotakAmal" : "DonasiKhusus")
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
          .eq("id", formData.sourceId);

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit {formData?.sourceType === 'donatur' ? 'Data Donatur' : 
                  formData?.sourceType === 'kotakAmal' ? 'Kotak Amal' : 
                  'Donasi Khusus'} {year}
          </DialogTitle>
        </DialogHeader>

        {formData && (
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
                      type="text"
                      value={formatNumber((formData[field as keyof IntegratedData] as number).toString())}
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
                type="text"
                value={formatNumber(formData.infaq.toString())}
                onChange={(e) => handleInputChange("infaq", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        )}

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
  );
}
