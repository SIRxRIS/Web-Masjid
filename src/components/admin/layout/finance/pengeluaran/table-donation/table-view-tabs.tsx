"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconLayoutColumns,
  IconDownload,
  IconFileSpreadsheet,
  IconPrinter,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DonaturData } from "./schema";
import AddDonation from "../add-donation";

interface TableViewTabsProps {
  table?: Table<DonaturData>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder?: string;
  year: string;
  setYear: (value: string) => void;
  availableYears?: string[];
}

export function TableViewTabs({ 
  table,
  searchQuery,
  setSearchQuery,
  placeholder = "Cari pengeluaran...",    
  year,
  setYear,
  availableYears = ["2023", "2024", "2025"],
}: TableViewTabsProps) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Cari Pengeluaran
          </Label>
          <Input
            id="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 max-w-[320px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tahun" className="text-sm whitespace-nowrap">
            Tahun:
          </Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger id="tahun" className="w-24 h-9">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
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
        <AddDonation />
      </div>
    </div>
  );
}
