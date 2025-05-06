"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { type RekapPemasukan, type RekapPengeluaran } from "./schema";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { syncAllPemasukan } from "@/lib/services/supabase/pemasukan/pemasukan";

interface TableViewTabsProps {
  table?: Table<RekapPemasukan | RekapPengeluaran>;
  onDataChange?: (data: RekapPemasukan | RekapPengeluaran) => void;
}

export function TableViewTabs({ table }: TableViewTabsProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllPemasukan();
      toast.success("Data pemasukan berhasil disinkronkan!");
    } catch (error) {
      console.error("Gagal sinkronisasi:", error);
      toast.error("Gagal mensinkronkan data. Silakan coba lagi.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="view-selector" className="sr-only">
          Jenis Tampilan
        </Label>
        {/* Mobile Select Menu */}
        <Select defaultValue="rekap-tahunan">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Pilih tampilan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rekap-tahunan">Rekap Tahunan</SelectItem>
            <SelectItem value="laporan-jumat">Laporan Jumat</SelectItem>
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger
            value="rekap-tahunan"
            title="Rekap keuangan tahunan masjid"
          >
            Rekap Tahunan
          </TabsTrigger>
          <TabsTrigger
            value="laporan-jumat"
            title="Laporan keuangan mingguan setiap hari Jumat"
          >
            Laporan Jumat
          </TabsTrigger>
        </TabsList>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isSyncing}
        className="gap-2"
      >
        {isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {isSyncing ? "Sedang Sinkronisasi..." : "Sinkronkan Data"}
      </Button>
    </div>
  );
}
