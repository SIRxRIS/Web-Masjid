"use client";

import * as React from "react";
import { type PengeluaranData } from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { Tabs } from "@/components/ui/tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { TableToolbar } from "./table-toolbar";

interface DataTableProps {
  data: PengeluaranData[];
}

export function DataTable({
  data: initialPengeluaranData,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState("2025");
  const [activeTab, setActiveTab] = React.useState("riwayat-tahunan");

  const getPlaceholder = () => {
    switch (activeTab) {
      case "riwayat-tahunan":
        return "Cari pengeluaran...";
      case "pengeluaran-bulanan":
        return "Cari pengeluaran bulanan...";
      default:
        return "Cari...";
    }
  };

  return (
    <div className="w-full flex-col justify-start gap-6">
      <Tabs
        defaultValue="riwayat-tahunan"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TableViewTabs />
        <TableToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={getPlaceholder()}
          year={year}
          setYear={setYear}
        />
        <DataTableTabsContent
          pengeluaranData={initialPengeluaranData}
          searchQuery={searchQuery}
          year={year}
        />
      </Tabs>
    </div>
  );
}
