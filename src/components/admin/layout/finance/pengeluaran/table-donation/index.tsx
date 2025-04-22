"use client";

import * as React from "react";
import {
  type DonaturData,
} from "./schema";
import { TableViewTabs } from "./table-view-tabs";
import { DataTableTabsContent } from "./data-table-tabs-content";

interface DataTableProps {
  data: DonaturData[];
}

export function DataTable({
  data: initialDonaturData,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [year, setYear] = React.useState("2025");

  return (
    <div className="w-full flex-col justify-start gap-6">
      <TableViewTabs 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Cari pengeluaran..."
        year={year}
        setYear={setYear}
      />
      <DataTableTabsContent
        donaturData={initialDonaturData}
        searchQuery={searchQuery}
        year={year}
      />
    </div>
  );
}
