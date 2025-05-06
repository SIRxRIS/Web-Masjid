"use client";

import * as React from "react";
import { type InventarisData } from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { Tabs } from "@/components/ui/tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { TableToolbar } from "./table-toolbar";
import { getAvailableTahun } from "@/lib/services/supabase/inventaris/inventaris";
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';

interface DataTableProps {
  data: InventarisData[];
  onDataChange?: (data: InventarisData[]) => void;
}

export function DataTable({
  data: inventarisData,
  onDataChange,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("daftar-inventaris");
  const [availableYears, setAvailableYears] = React.useState<string[]>([]);
  const [localData, setLocalData] = React.useState<InventarisData[]>(inventarisData);

  React.useEffect(() => {
    setLocalData(inventarisData);
  }, [inventarisData]);

  React.useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await getAvailableTahun();
        const yearStrings = years.map(year => year.toString());
        setAvailableYears(yearStrings);
        if (yearStrings.length > 0) {
          setYear(yearStrings[0]);
        }
      } catch (error) {
        console.error("Error mengambil data tahun:", error);
      }
    };

    fetchYears();
  }, []);

  const handleDataChange = (newData: InventarisData[]) => {
    setLocalData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "daftar-inventaris":
        return "Cari inventaris...";
      case "galeri-inventaris":
        return "Cari galeri inventaris...";
      default:
        return "Cari...";
    }
  };

  const table = useReactTable({
    data: localData,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleInventarisAdded = (newData: InventarisData) => {
    const updatedData = [...localData, newData].map((item, index) => ({
      ...item,
      no: index + 1
    }));
    setLocalData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  return (
    <div className="w-full flex-col justify-start gap-6">
      <Tabs defaultValue="daftar-inventaris" onValueChange={(value) => setActiveTab(value)}>
        <TableViewTabs onInventarisAdded={handleInventarisAdded} />
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
          inventarisData={localData}
          searchQuery={searchQuery}
          year={year}
          onDataChange={handleDataChange}
        />
      </Tabs>
    </div>
  );
}