"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import AddInventaris from "./add-inventaris";
import { type InventarisData } from "./schema";

interface TableViewTabsProps {
  table?: Table<InventarisData>;
  onInventarisAdded?: (newData: InventarisData) => void;
}

export function TableViewTabs({ table, onInventarisAdded }: TableViewTabsProps) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="view-selector" className="sr-only">
          Jenis Tampilan
        </Label>
        {/* Mobile Select Menu */}
        <Select defaultValue="daftar-inventaris">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Pilih tampilan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daftar-inventaris">Daftar Inventaris</SelectItem>
            <SelectItem value="galeri-inventaris">Galeri Inventaris</SelectItem>
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger
            value="daftar-inventaris"
            title="Daftar lengkap inventaris masjid beserta detailnya"
          >
            Daftar Inventaris
          </TabsTrigger>
          <TabsTrigger
            value="galeri-inventaris"
            title="Kumpulan foto inventaris masjid"
          >
            Galeri Inventaris
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex items-center gap-2">
        <AddInventaris onInventarisAdded={onInventarisAdded} />
      </div>
    </div>
  );
}
