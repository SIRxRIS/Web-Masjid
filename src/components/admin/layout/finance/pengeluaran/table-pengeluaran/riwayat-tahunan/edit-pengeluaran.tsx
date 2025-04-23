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
import { PengeluaranData, PengeluaranTahunanData } from "../schema";
import { formatNumber, unformatNumber } from "../../../pemasukan/table-donation/utils";

interface EditPengeluaranProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: number;
    no: number;
    nama: string;
    tanggal: Date;
    jumlah: number;
    createdAt: Date;
    updatedAt: Date;
    keterangan?: string;
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    mei?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    okt?: number;
    nov?: number;
    des?: number;
  } | null;
  onSave: (updatedData: PengeluaranTahunanData) => void;
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
  const [monthlyData, setMonthlyData] = React.useState<{
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    okt: number;
    nov: number;
    des: number;
  }>({
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    mei: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    okt: 0,
    nov: 0,
    des: 0,
  });

  React.useEffect(() => {
    if (data) {
      setFormData({ ...data });
      // Fetch monthly data for this pengeluaran if available
      fetchMonthlyData(data.id);
    }
  }, [data]);

  const fetchMonthlyData = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from("PengeluaranTahunan")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching monthly data:", error);
        return;
      }

      if (data) {
        setMonthlyData({
          jan: data.jan || 0,
          feb: data.feb || 0,
          mar: data.mar || 0,
          apr: data.apr || 0,
          mei: data.mei || 0,
          jun: data.jun || 0,
          jul: data.jul || 0,
          aug: data.aug || 0,
          sep: data.sep || 0,
          okt: data.okt || 0,
          nov: data.nov || 0,
          des: data.des || 0,
        });
      }
    } catch (err) {
      console.error("Error in fetchMonthlyData:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!formData) return;

    const processedValue = field === 'nama' || field === 'keterangan' 
      ? value 
      : field === 'jumlah' 
        ? unformatNumber(value)
        : value;

    setFormData({
      ...formData,
      [field]: processedValue,
    });
  };

  const handleMonthlyChange = (month: string, value: string) => {
    setMonthlyData({
      ...monthlyData,
      [month]: unformatNumber(value),
    });
  };

  const handleSave = async () => {
    if (formData) {
      try {
        // Update the basic pengeluaran data
        const { error: pengeluaranError } = await supabase
          .from("Pengeluaran")
          .update({
            nama: formData.nama,
            tanggal: formData.tanggal,
            jumlah: formData.jumlah,
            keterangan: formData.keterangan,
          })
          .eq("id", formData.id);

        if (pengeluaranError) {
          console.error("Error updating pengeluaran:", pengeluaranError);
          throw new Error("Gagal memperbarui data pengeluaran");
        }

        // Update the monthly data
        const { error: monthlyError } = await supabase
          .from("PengeluaranTahunan")
          .update({
            pengeluaran: formData.nama,
            ...monthlyData,
          })
          .eq("id", formData.id);

        if (monthlyError) {
          console.error("Error updating monthly data:", monthlyError);
          throw new Error("Gagal memperbarui data bulanan");
        }

        // Create combined data to pass back
        const updatedData: PengeluaranTahunanData = {
          id: formData.id,
          no: formData.no,
          pengeluaran: formData.nama,
          ...monthlyData,
        };

        onSave(updatedData);
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
          text: err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui data",
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
            Edit Data Pengeluaran {year}
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

            {/* Monthly data inputs */}
            <div className="border rounded-md p-4 mt-2">
              <h3 className="font-semibold mb-2">Data Bulanan</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(monthlyData).map(([month, value]) => (
                  <div key={month} className="grid grid-cols-5 items-center gap-2">
                    <Label htmlFor={month} className="text-right col-span-2 capitalize">
                      {month}
                    </Label>
                    <Input
                      id={month}
                      value={formatNumber(value.toString())}
                      onChange={(e) => handleMonthlyChange(month, e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keterangan" className="text-right">
                Keterangan
              </Label>
              <Input
                id="keterangan"
                value={formData.keterangan || ""}
                onChange={(e) => handleInputChange("keterangan", e.target.value)}
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