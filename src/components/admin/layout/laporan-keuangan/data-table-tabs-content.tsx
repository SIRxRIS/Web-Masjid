  "use client";

  import * as React from "react";
  import { TabsContent } from "@/components/ui/tabs";
  import { TableRekapTahunan } from "./table/rekap-tahunan/table-rekap";
  import  TableLaporanJumat  from "./table/laporan-jum'at/table-laporan";
  import { type RekapPemasukan, type RekapPengeluaran } from "./schema";
  import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table";

  interface DataTableTabsContentProps {
    pemasukanData: RekapPemasukan[];
    pengeluaranData: RekapPengeluaran[];
    searchQuery: string;
    year: string;
    onDataChange?: (type: 'pemasukan' | 'pengeluaran', data: RekapPemasukan[] | RekapPengeluaran[]) => void;
  }

  export function DataTableTabsContent({
    pemasukanData,
    pengeluaranData,
    searchQuery,
    year,
    onDataChange,
  }: DataTableTabsContentProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    
    const filteredPemasukanData = React.useMemo(() => {
      let filtered = pemasukanData;

      if (year) {
        filtered = filtered.filter(item => item.tahun.toString() === year);
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) => 
            item.sumber.toLowerCase().includes(lowerQuery)
        );
      }

      return filtered;
    }, [pemasukanData, searchQuery, year]);

    const filteredPengeluaranData = React.useMemo(() => {
      let filtered = pengeluaranData;

      if (year) {
        filtered = filtered.filter(item => item.tahun.toString() === year);
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) => 
            item.nama.toLowerCase().includes(lowerQuery)
        );
      }

      return filtered;
    }, [pengeluaranData, searchQuery, year]);

    const table = useReactTable({
      data: [...filteredPemasukanData, ...filteredPengeluaranData],
      columns: [],
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    });
    
    return (
      <>
        <TabsContent
          value="rekap-tahunan"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <TableRekapTahunan 
            pemasukanData={filteredPemasukanData}
            pengeluaranData={filteredPengeluaranData}
            tahun={parseInt(year)}
            namaMasjid="Jawahiruzzarqa"
            onDataChange={onDataChange}
          />
        </TabsContent>

        <TabsContent 
          value="laporan-jumat" 
          className="flex flex-col px-4 lg:px-6"
        >
          <TableLaporanJumat />
        </TabsContent>
      </>
    );
  }
