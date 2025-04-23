"use client";

import * as React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { TableRiwayatTahunan } from "./riwayat-tahunan/table-riwayat-tahunan";
import { TablePengeluaran } from "./table-pengeluaran-bulanan/table-pengeluaran";
import {
  type PengeluaranData,
  type PengeluaranTahunanData,
} from "./schema";

interface DataTableTabsContentProps {
  pengeluaranData: PengeluaranData[];
  searchQuery: string;
  year: string;
}

export function DataTableTabsContent({
  pengeluaranData,
  searchQuery,
  year,
}: DataTableTabsContentProps) {
  const filteredPengeluaranData = React.useMemo(() => {
    if (!searchQuery) return pengeluaranData;

    const lowerQuery = searchQuery.toLowerCase();
    return pengeluaranData.filter(
      (item) =>
        item.nama.toLowerCase().includes(lowerQuery) ||
        (item.keterangan?.toLowerCase() || '').includes(lowerQuery)
    );
  }, [pengeluaranData, searchQuery]);

  // Transform PengeluaranData to PengeluaranTahunanData
  const transformedData = React.useMemo(() => {
    const monthlyData = filteredPengeluaranData.reduce((acc, item) => {
      const month = new Date(item.tanggal).getMonth();
      const monthKey = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'][month] as keyof Pick<PengeluaranTahunanData, 'jan' | 'feb' | 'mar' | 'apr' | 'mei' | 'jun' | 'jul' | 'aug' | 'sep' | 'okt' | 'nov' | 'des'>;
      
      if (!acc[item.nama]) {
        acc[item.nama] = {
          id: item.id,
          no: item.no,
          pengeluaran: item.nama,
          jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0,
          jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0
        };
      }
      
      acc[item.nama][monthKey] = item.jumlah;
      return acc;
    }, {} as Record<string, PengeluaranTahunanData>);

    return Object.values(monthlyData);
  }, [filteredPengeluaranData]);

  return (
    <>
      <TabsContent
        value="riwayat-tahunan"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableRiwayatTahunan 
          pengeluaranData={transformedData}
          year={year}
        />
      </TabsContent>

      <TabsContent 
        value="pengeluaran-bulanan" 
        className="flex flex-col px-4 lg:px-6"
      >
        <TablePengeluaran 
          pengeluaranData={filteredPengeluaranData} 
          year={year} 
        />
      </TabsContent>
    </>
  );
}
