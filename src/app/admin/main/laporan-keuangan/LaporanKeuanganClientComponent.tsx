"use client";

import { type RekapPemasukan, type RekapPengeluaran } from "@/components/admin/layout/laporan-keuangan/schema";
import { getRekapPemasukanTahunan, getRekapPengeluaranTahunan } from "@/lib/services/supabase/rekap-tahunan";
import { syncAllPemasukan } from "@/lib/services/supabase/pemasukan/pemasukan";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/layout/laporan-keuangan";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function LaporanKeuanganClientComponent() {
  const [pemasukanData, setPemasukanData] = useState<RekapPemasukan[]>([]);
  const [pengeluaranData, setPengeluaranData] = useState<RekapPengeluaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      
      const [pemasukanResult, pengeluaranResult] = await Promise.all([
        getRekapPemasukanTahunan(currentYear),
        getRekapPengeluaranTahunan(currentYear)
      ]);
      
      setPemasukanData(pemasukanResult);
      setPengeluaranData(pengeluaranResult);
    } catch (error) {
      console.error("Error mengambil data rekap:", error);
      toast.error("Gagal mengambil data rekap");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllPemasukan();
      toast.success("Data pemasukan berhasil disinkronkan!");
      // Refresh data setelah sinkronisasi
      await fetchData();
    } catch (error) {
      console.error("Gagal sinkronisasi:", error);
      toast.error("Gagal mensinkronkan data. Silakan coba lagi.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDataChange = async (type: 'pemasukan' | 'pengeluaran', data: RekapPemasukan[] | RekapPengeluaran[]) => {
    if (type === 'pemasukan') {
      setPemasukanData(data as RekapPemasukan[]);
    } else {
      setPengeluaranData(data as RekapPengeluaran[]);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : (
            <DataTable 
              pemasukanData={pemasukanData}
              pengeluaranData={pengeluaranData}
              onDataChange={handleDataChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}