"use client";

import * as React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { TableInventaris } from "./table/table-inventaris";
import { TableViewTabs } from "./table-view-tabs";
import GalleryInventaris from "./gallerry-inventaris/page";
import { type InventarisData } from "./schema";
import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table";

interface DataTableTabsContentProps {
  inventarisData: InventarisData[];
  searchQuery: string;
  year: string;
  onDataChange?: (data: InventarisData[]) => void; 
}

export function DataTableTabsContent({
  inventarisData,
  searchQuery,
  year,
  onDataChange,
}: DataTableTabsContentProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const filteredInventarisData = React.useMemo(() => {
    let filtered = inventarisData;

    if (year) {
      filtered = filtered.filter(item => item.tahun.toString() === year);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.namaBarang.toLowerCase().includes(lowerQuery) ||
          item.kategori.toLowerCase().includes(lowerQuery) ||
          item.lokasi.toLowerCase().includes(lowerQuery) ||
          (item.keterangan?.toLowerCase() || '').includes(lowerQuery)
      );
    }

    return filtered;
  }, [inventarisData, searchQuery, year]);

  const table = useReactTable({
    data: filteredInventarisData,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  return (
    <>
      <TabsContent
        value="daftar-inventaris"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableInventaris 
          inventarisData={filteredInventarisData} 
          onDataChange={onDataChange}
        />
      </TabsContent>

      <TabsContent 
        value="galeri-inventaris" 
        className="flex flex-col px-4 lg:px-6"
      >
        <GalleryInventaris inventarisData={filteredInventarisData} isLoading={isLoading} />
      </TabsContent>
    </>
  );
}
