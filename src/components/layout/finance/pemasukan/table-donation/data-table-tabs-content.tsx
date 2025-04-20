"use client";

import * as React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { DataTable as DonasiKhususTable } from "./donasi-khusus/table-donation-primary";
import { DataTable as KotakAmalTable } from "./kotak-amal/table-kotak-amal";
import { TableRiwayatTahunan } from "./riwayat-tahunan/table-riwayat-tahunan";
import {
  type DonaturData,
  type KotakAmalData,
  type DonasiKhususData,
} from "./schema";

interface DataTableTabsContentProps {
  donaturData: DonaturData[];
  kotakAmalData: KotakAmalData[];
  donasiKhususData: DonasiKhususData[];
  searchQuery: string;
  year: string;
}

export function DataTableTabsContent({
  donaturData,
  kotakAmalData,
  donasiKhususData,
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

  const filteredKotakAmalData = React.useMemo(() => {
    if (!searchQuery) return kotakAmalData;

    const lowerQuery = searchQuery.toLowerCase();
    return kotakAmalData.filter(
      (item) =>
        item.nama.toLowerCase().includes(lowerQuery) ||
        item.lokasi.toLowerCase().includes(lowerQuery)
    );
  }, [kotakAmalData, searchQuery]);

  const filteredDonasiKhususData = React.useMemo(() => {
    if (!searchQuery) return donasiKhususData;

    const lowerQuery = searchQuery.toLowerCase();
    return donasiKhususData.filter(
      (item) =>
        item.nama.toLowerCase().includes(lowerQuery) ||
        item.keterangan.toLowerCase().includes(lowerQuery)
    );
  }, [donasiKhususData, searchQuery]);

  const renderPlaceholder = (message: string) => (
    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
      {message}
    </div>
  );

  return (
    <>
      <TabsContent
        value="riwayat-tahunan"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableRiwayatTahunan data={filteredDonaturData} year={year} />
      </TabsContent>

      <TabsContent value="donasi-khusus" className="flex flex-col px-4 lg:px-6">
        <DonasiKhususTable data={filteredDonasiKhususData} year={year} />
      </TabsContent>

      <TabsContent value="kotak-amal" className="flex flex-col px-4 lg:px-6">
        <KotakAmalTable data={filteredKotakAmalData} year={year} />
      </TabsContent>
    </>
  );
}
