"use client";

import * as React from "react";
import { TableRiwayatTahunan } from "./riwayat-tahunan/table-riwayat-tahunan";
import { type DonaturData } from "./schema";

interface DataTableTabsContentProps {
  donaturData: DonaturData[];
  searchQuery: string;
  year: string;
}

export function DataTableTabsContent({
  donaturData,
  searchQuery,
  year,
}: DataTableTabsContentProps) {
  const filteredDonaturData = React.useMemo(() => {
    if (!searchQuery) return donaturData;

    const lowerQuery = searchQuery.toLowerCase();
    return donaturData.filter(
      (item) =>
        item.nama.toLowerCase().includes(lowerQuery) ||
        item.alamat.toLowerCase().includes(lowerQuery)
    );
  }, [donaturData, searchQuery]);

  return (
    <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      <TableRiwayatTahunan 
        donaturData={filteredDonaturData}
        year={year}
      />
    </div>
  );
}
