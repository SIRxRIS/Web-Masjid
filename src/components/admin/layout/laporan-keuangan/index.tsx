"use client";

import * as React from "react";
import { type RekapPemasukan, type RekapPengeluaran } from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { Tabs } from "@/components/ui/tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { TableToolbar } from "./table-toolbar";
import { getAvailableTahun as getPemasukanYears } from "@/lib/services/supabase/pemasukan/pemasukan";
import { getAvailableTahun as getPengeluaranYears } from "@/lib/services/supabase/pengeluaran/pengeluaran";
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';

interface DataTableProps {
  pemasukanData: RekapPemasukan[];
  pengeluaranData: RekapPengeluaran[];
  onDataChange?: (type: 'pemasukan' | 'pengeluaran', data: RekapPemasukan[] | RekapPengeluaran[]) => void;
}

export function DataTable({
  pemasukanData: initialPemasukanData,
  pengeluaranData: initialPengeluaranData,
  onDataChange,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("rekap-tahunan");
  const [availableYears, setAvailableYears] = React.useState<string[]>([]);
  const [localPemasukanData, setLocalPemasukanData] = React.useState<RekapPemasukan[]>(initialPemasukanData);
  const [localPengeluaranData, setLocalPengeluaranData] = React.useState<RekapPengeluaran[]>(initialPengeluaranData);

  React.useEffect(() => {
    setLocalPemasukanData(initialPemasukanData);
    setLocalPengeluaranData(initialPengeluaranData);
  }, [initialPemasukanData, initialPengeluaranData]);

  React.useEffect(() => {
    const fetchYears = async () => {
      try {
        const [pemasukanYears, pengeluaranYears] = await Promise.all([
          getPemasukanYears(),
          getPengeluaranYears()
        ]);
        
        const allYears = [...pemasukanYears, ...pengeluaranYears];
        const uniqueYears = [...new Set(allYears)].map(year => year.toString());
        setAvailableYears(uniqueYears);
        if (uniqueYears.length > 0) {
          setYear(uniqueYears[0]);
        }
      } catch (error) {
        console.error("Error mengambil data tahun:", error);
      }
    };

    fetchYears();
  }, []);

  const handleDataChange = (type: 'pemasukan' | 'pengeluaran', newData: RekapPemasukan[] | RekapPengeluaran[]) => {
    if (type === 'pemasukan') {
      setLocalPemasukanData(newData as RekapPemasukan[]);
    } else {
      setLocalPengeluaranData(newData as RekapPengeluaran[]);
    }
    
    if (onDataChange) {
      onDataChange(type, newData);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "rekap-tahunan":
        return "Cari sumber pemasukan atau pengeluaran...";
      case "laporan-jumat":
        return "Cari laporan jumat...";
      default:
        return "Cari...";
    }
  };

  const table = useReactTable({
    data: [...localPemasukanData, ...localPengeluaranData],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full flex-col justify-start gap-6">
      <Tabs defaultValue="rekap-tahunan" onValueChange={(value) => setActiveTab(value)}>
        <TableViewTabs />
        <TableToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={getPlaceholder()}
          year={year}
          setYear={setYear}
          availableYears={availableYears}
          table={table}
        />
        <DataTableTabsContent
          pemasukanData={localPemasukanData}
          pengeluaranData={localPengeluaranData}
          searchQuery={searchQuery}
          year={year}
          onDataChange={handleDataChange}
        />
      </Tabs>
    </div>
  );
}