"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconLayoutColumns,
  IconDownload,
  IconFileSpreadsheet,
  IconPrinter,
} from "@tabler/icons-react";
import { getAvailableTahun } from "@/lib/services/supabase/pengeluaran/pengeluaran";
import { PengeluaranData, PengeluaranTahunanData } from "./schema";

interface TableToolbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder?: string;
  year: string;
  setYear: (value: string) => void;
  availableYears?: string[];
  table?: Table<PengeluaranData | PengeluaranTahunanData>;  
}

export function TableToolbar({
  searchQuery,
  setSearchQuery,
  placeholder = "Cari pengeluaran...",
  year,
  setYear,
  availableYears = [],
  table,
}: TableToolbarProps) {
  const [years, setYears] = React.useState<string[]>(availableYears);

  React.useEffect(() => {
    const fetchYears = async () => {
      try {
        const availableYears = await getAvailableTahun();
        setYears(availableYears.map(year => year.toString()));
      } catch (error) {
        console.error("Error mengambil data tahun:", error);
      }
    };

    fetchYears();
  }, []);

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Cari
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
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </div>
      </div>
    </div>
  );
}
