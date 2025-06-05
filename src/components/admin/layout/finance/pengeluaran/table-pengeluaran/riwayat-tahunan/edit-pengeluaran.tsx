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
import { createClient } from "@/lib/supabase/client";
import { PengeluaranData, PengeluaranTahunanData } from "../schema";
import {
  formatNumber,
  unformatNumber,
} from "../../../pemasukan/table-donation/utils";

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
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      // Tambahkan field tahun yang hilang
      const formDataWithTahun: PengeluaranData = {
        id: data.id,
        no: data.no,
        nama: data.nama,
        tanggal: data.tanggal,
        tahun: parseInt(year), // Tambahkan field tahun
        jumlah: data.jumlah,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        keterangan: data.keterangan,
      };

      setFormData(formDataWithTahun);

      // Set monthly data dari props jika tersedia
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

      // Fetch additional monthly data if needed
      fetchMonthlyData(data.id);
    }
  }, [data, year]);

  const fetchMonthlyData = async (id: number) => {
    try {
      const supabase = createClient();
      const { data: monthlyDataFromDB, error } = await supabase
        .from("PengeluaranTahunan")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching monthly data:", error);
        return;
      }

      if (monthlyDataFromDB) {
        setMonthlyData({
          jan: monthlyDataFromDB.jan || 0,
          feb: monthlyDataFromDB.feb || 0,
          mar: monthlyDataFromDB.mar || 0,
          apr: monthlyDataFromDB.apr || 0,
          mei: monthlyDataFromDB.mei || 0,
          jun: monthlyDataFromDB.jun || 0,
          jul: monthlyDataFromDB.jul || 0,
          aug: monthlyDataFromDB.aug || 0,
          sep: monthlyDataFromDB.sep || 0,
          okt: monthlyDataFromDB.okt || 0,
          nov: monthlyDataFromDB.nov || 0,
          des: monthlyDataFromDB.des || 0,
        });
      }
    } catch (err) {
      console.error("Error in fetchMonthlyData:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!formData) return;

    const processedValue =
      field === "nama" || field === "keterangan"
        ? value
        : field === "jumlah"
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
    if (!formData || isLoading) return;

    setIsLoading(true);
    try {
      // Validasi input
      if (!formData.nama.trim()) {
        throw new Error("Nama pengeluaran harus diisi");
      }

      const supabase = createClient();

      // Update tabel Pengeluaran
      const { error: pengeluaranError } = await supabase
        .from("Pengeluaran")
        .update({
          nama: formData.nama.trim(),
          tanggal: formData.tanggal,
          tahun: formData.tahun,
          jumlah: formData.jumlah,
          keterangan: formData.keterangan?.trim() || null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", formData.id);

      if (pengeluaranError) {
        console.error("Error updating pengeluaran:", pengeluaranError);
        throw new Error("Gagal memperbarui data pengeluaran");
      }

      // Update atau insert data bulanan
      const { error: monthlyError } = await supabase
        .from("PengeluaranTahunan")
        .upsert(
          {
            id: formData.id,
            pengeluaran: formData.nama.trim(),
            ...monthlyData,
          },
          {
            onConflict: "id",
          }
        );

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

      await Swal.fire({
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

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui data";

      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = {
    jan: "Januari",
    feb: "Februari",
    mar: "Maret",
    apr: "April",
    mei: "Mei",
    jun: "Juni",
    jul: "Juli",
    aug: "Agustus",
    sep: "September",
    okt: "Oktober",
    nov: "November",
    des: "Desember",
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
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                className="col-span-3"
                disabled={isLoading}
                placeholder="Masukkan nama pengeluaran"
              />
            </div>

            {/* Monthly data inputs */}
            <div className="border rounded-md p-4 mt-2">
              <h3 className="font-semibold mb-3">Data Bulanan (Rp)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(monthlyData).map(([month, value]) => (
                  <div
                    key={month}
                    className="grid grid-cols-5 items-center gap-2"
                  >
                    <Label htmlFor={month} className="text-right col-span-2">
                      {monthNames[month as keyof typeof monthNames]}
                    </Label>
                    <Input
                      id={month}
                      value={formatNumber(value.toString())}
                      onChange={(e) =>
                        handleMonthlyChange(month, e.target.value)
                      }
                      className="col-span-3"
                      disabled={isLoading}
                      placeholder="0"
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
                onChange={(e) =>
                  handleInputChange("keterangan", e.target.value)
                }
                className="col-span-3"
                disabled={isLoading}
                placeholder="Keterangan tambahan (opsional)"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button
              className="text-white"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
