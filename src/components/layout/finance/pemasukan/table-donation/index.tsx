"use client";

import * as React from "react";
import {
  type DonaturData,
  type KotakAmalData,
  type DonasiKhususData,
} from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { Tabs } from "@/components/ui/tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { TableToolbar } from "./table-toolbar";

interface DataTableProps {
  data: DonaturData[];
  kotakAmalData: KotakAmalData[];
  donasiKhususData: DonasiKhususData[];
}

export function DataTable({
  data: initialDonaturData,
  kotakAmalData: initialKotakAmalData,
  donasiKhususData: initialDonasiKhususData,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState("2025");
  const [activeTab, setActiveTab] = React.useState("riwayat-tahunan");

  const getPlaceholder = () => {
    switch (activeTab) {
      case "riwayat-tahunan":
        return "Cari nama atau alamat donatur...";
      case "kotak-amal":
        return "Cari nama atau lokasi kotak amal...";
      case "donasi-khusus":
        return "Cari nama donatur atau keterangan...";
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
          donaturData={initialDonaturData}
          kotakAmalData={initialKotakAmalData}
          donasiKhususData={initialDonasiKhususData}
          searchQuery={searchQuery}
          year={year}
        />
      </Tabs>
    </div>
  );
}
