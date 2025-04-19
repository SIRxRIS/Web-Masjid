"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  IconLayoutColumns,
  IconDownload,
  IconFileSpreadsheet,
  IconPrinter,
  IconPlus,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DonaturData } from "./schema";

interface TableViewTabsProps {
  table?: Table<DonaturData>;
}

export function TableViewTabs({ table }: TableViewTabsProps) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="view-selector" className="sr-only">
          Jenis Tampilan
        </Label>
        {/* Mobile Select Menu */}
        <Select defaultValue="riwayat-tahunan">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Pilih tampilan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="riwayat-tahunan">Riwayat Tahunan</SelectItem>
            <SelectItem value="donasi-khusus">Donasi Khusus</SelectItem>
            <SelectItem value="kotak-amal">Kotak Amal</SelectItem>
            <SelectItem value="rekap">Rekap Bulanan</SelectItem>
          </SelectContent>
        </Select>

        {/* Desktop Tabs */}
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger
            value="riwayat-tahunan"
            title="Daftar lengkap donatur beserta riwayat donasi tahunan"
          >
            Riwayat Tahunan
          </TabsTrigger>
          <TabsTrigger
            value="donasi-khusus"
            title="Catatan donasi khusus yang masuk bulan ini"
          >
            Donasi Khusus
          </TabsTrigger>
          <TabsTrigger
            value="kotak-amal"
            title="Catatan pemasukan dari kotak amal"
          >
            Kotak Amal
          </TabsTrigger>
          <TabsTrigger
            value="rekap"
            title="Ringkasan total donasi per kategori"
          >
            Rekap Bulanan
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconDownload className="size-4 mr-1" />
              <span>Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <IconFileSpreadsheet className="mr-2 size-4" />
              <span>Excel (.xlsx)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconFileSpreadsheet className="mr-2 size-4" />
              <span>CSV (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPrinter className="mr-2 size-4" />
              <span>Print</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4 mr-1" />
                <span>Kolom</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "aug"
                      ? "Agust"
                      : column.id === "sep"
                      ? "Sept"
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="outline" size="sm">
          <IconPlus className="size-4 mr-1" />
          <span>Tambah Donatur</span>
        </Button>
      </div>
    </div>
  );
}
