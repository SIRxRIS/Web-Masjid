"use client";

import * as React from "react";
import {
  type DonaturData,
  type KotakAmalData,
  type DonasiKhususData,
  type KotakAmalMasjidData,
} from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { Tabs } from "@/components/ui/tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { TableToolbar } from "./table-toolbar";
import { 
  getAvailableTahun as getDonaturYears, 
} from "@/lib/services/supabase/donatur";
import { 
  getAvailableTahun as getDonasiKhususYears 
} from "@/lib/services/supabase/donasi-khusus";
import { 
  getAvailableTahun as getKotakAmalYears 
} from "@/lib/services/supabase/kotak-amal";
import { 
  getAvailableTahun as getKotakAmalMasjidYears 
} from "@/lib/services/supabase/kotak-amal-masjid";

interface DataTableProps {
  data: DonaturData[];
  kotakAmalData: KotakAmalData[];
  donasiKhususData: DonasiKhususData[];
  kotakAmalMasjidData: KotakAmalMasjidData[];
}

export function DataTable({
  data: initialDonaturData,
  kotakAmalData: initialKotakAmalData,
  donasiKhususData: initialDonasiKhususData,
  kotakAmalMasjidData: initialKotakAmalMasjidData,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState("2025");
  const [activeTab, setActiveTab] = React.useState("riwayat-tahunan");

  const getFetchYearsFunction = React.useCallback(() => {
    switch (activeTab) {
      case "riwayat-tahunan":
        return async () => {
          try {
            const [donaturYears, kotakAmalYears, donasiKhususYears, kotakAmalMasjidYears] = await Promise.all([
              getDonaturYears().catch(() => []),
              getKotakAmalYears().catch(() => []),
              getDonasiKhususYears().catch(() => []),
              getKotakAmalMasjidYears().catch(() => [])
            ]);
            
            const allYears = [...donaturYears, ...kotakAmalYears, ...donasiKhususYears, ...kotakAmalMasjidYears];
            const uniqueYears = [...new Set(allYears)].filter(year => year); // Filter out any falsy values
            
            if (uniqueYears.length === 0) {
              return [new Date().getFullYear()];
            }
            
            return uniqueYears;
          } catch (error) {
            console.error("Error saat mengambil data tahun:", error);
            return [new Date().getFullYear()];
          }
        };
      case "donasi-khusus":
        return getDonasiKhususYears;
      case "kotak-amal":
        return getKotakAmalYears;
      case "kotak-amal-masjid":
        return getKotakAmalMasjidYears;
      default:
        return getDonaturYears;
    }
  }, [activeTab]);

  const getPlaceholder = () => {
    switch (activeTab) {
      case "riwayat-tahunan":
        return "Cari nama atau alamat donatur...";
      case "kotak-amal":
        return "Cari nama atau lokasi kotak amal...";
      case "donasi-khusus":
        return "Cari nama donatur atau keterangan...";
      case "kotak-amal-masjid":
        return "Cari tanggal atau jumlah kotak amal masjid...";
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
          fetchYears={getFetchYearsFunction()}
        />
        <DataTableTabsContent
          donaturData={initialDonaturData}
          kotakAmalData={initialKotakAmalData}
          donasiKhususData={initialDonasiKhususData}
          kotakAmalMasjidData={initialKotakAmalMasjidData}
          searchQuery={searchQuery}
          year={year}
        />
      </Tabs>
    </div>
  );
}
