"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  IconLayoutColumns,
  IconDownload,
  IconFileSpreadsheet,
  IconPrinter,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DonaturData } from "./schema";
import AddDonation from "../add-donation";
import { exportToExcel } from "@/lib/excel";
import { exportToCSV } from "@/lib/csv";
import { toast } from "sonner"; 

interface TableViewTabsProps {
  table?: Table<DonaturData>;
  isLoading?: boolean;
}

export function TableViewTabs({ table, isLoading = false }: TableViewTabsProps) {
  // State untuk melacak apakah tabel sudah siap
  const [isTableReady, setIsTableReady] = React.useState<boolean>(false);

  // Effect untuk memeriksa status tabel
  React.useEffect(() => {
    // Cek apakah tabel tersedia dan memiliki data
    const hasTable = table !== undefined;
    const hasData = hasTable && table.getRowModel().rows.length > 0;
    
    setIsTableReady(hasData);
    
    if (hasTable) {
      console.log("Table status:", {
        available: true,
        rowCount: table.getRowModel().rows.length
      });
    } else {
      console.log("Table status: not available");
    }
  }, [table]);

  const handleExport = (type: 'excel' | 'csv') => {
    try {
      // Check if table is available
      if (!table) {
        console.error("Table belum tersedia");
        showNotification("Table belum tersedia. Mohon tunggu hingga data dimuat.");
        return;
      }
      
      // Get data from table
      const data = table.getRowModel().rows.map(row => row.original);
      
      // Check if we have data to export
      if (!data || data.length === 0) {
        console.error("Tidak ada data untuk diekspor");
        showNotification("Tidak ada data yang tersedia untuk diekspor");
        return;
      }
      
      console.log(`Mengekspor ${data.length} baris data ke ${type}`);
      
      // Export based on selected type
      if (type === 'excel') {
        exportToExcel(data, 'data-donasi.xlsx');
      } else {
        exportToCSV(data, 'data-donasi.csv');
      }
    } catch (error) {
      console.error("Error saat mengekspor data:", error);
      showNotification("Terjadi kesalahan saat mengekspor data. Silakan coba lagi.");
    }
  };

  // Helper function untuk menampilkan notifikasi
  const showNotification = (message: string) => {
    if (typeof toast !== 'undefined') {
      toast.error(message, {
        description: "Export notification"
      });
    } else {
      alert(message);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="view-selector" className="sr-only">
          Jenis Tampilan
        </Label>
        {/* Mobile Select Menu */}
        <Select defaultValue="riwayat-tahunan">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Pilih tampilan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="riwayat-tahunan">Riwayat Tahunan</SelectItem>
            <SelectItem value="donasi-khusus">Donasi Khusus</SelectItem>
            <SelectItem value="kotak-amal">Kotak Amal</SelectItem>
            <SelectItem value="kotak-amal-masjid">Kotak Amal Masjid</SelectItem>
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger
            value="riwayat-tahunan"
            title="Daftar lengkap donatur beserta riwayat donasi tahunan"
          >
            Riwayat Tahunan
          </TabsTrigger>
          <TabsTrigger
            value="donasi-khusus"
            title="Catatan donasi khusus yang masuk bulan ini"
          >
            Donasi Khusus
          </TabsTrigger>
          <TabsTrigger
            value="kotak-amal"
            title="Catatan pemasukan dari kotak amal luar kompleks"
          >
            Kotak Amal
          </TabsTrigger>
          <TabsTrigger
            value="kotak-amal-masjid"
            title="Catatan pemasukan dari kotak amal masjid"
          >
            Kotak Amal Masjid
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading || !isTableReady}>
              <IconDownload className="size-4 mr-1" />
              <span>Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              <IconFileSpreadsheet className="mr-2 size-4" />
              <span>Excel (.xlsx)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <IconFileSpreadsheet className="mr-2 size-4" />
              <span>CSV (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPrinter className="mr-2 size-4" />
              <span>Print</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4 mr-1" />
                <span>Kolom</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "aug"
                      ? "Agust"
                      : column.id === "sep"
                      ? "Sept"
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <AddDonation />
      </div>
    </div>
  );
}