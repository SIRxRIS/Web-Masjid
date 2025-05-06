"use client";

import * as React from "react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableToolbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder?: string;
  year: string;
  setYear: (value: string) => void;
  fetchYears: () => Promise<number[]>; // Fungsi untuk mengambil data tahun
}

export function TableToolbar({
  searchQuery,
  setSearchQuery,
  placeholder = "Cari nama atau alamat...",
  year,
  setYear,
  fetchYears, // Terima fungsi langsung tanpa harus menentukan tipe service
}: TableToolbarProps) {
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getYears = async () => {
      try {
        setIsLoading(true);
        const yearsData = await fetchYears();
        
        if (yearsData && yearsData.length > 0) {
          const sortedYears = [...yearsData].sort((a, b) => b - a); // Urutkan tahun dari terbaru
          const yearsString = sortedYears.map(year => year.toString());
          setAvailableYears(yearsString);
          
          // Jika tahun belum dipilih atau tidak valid, pilih tahun terbaru
          if (!year || !yearsString.includes(year)) {
            setYear(yearsString[0]);
          }
        } else {
          // Jika tidak ada data tahun, gunakan tahun saat ini
          const currentYear = new Date().getFullYear().toString();
          setAvailableYears([currentYear]);
          setYear(currentYear);
        }
      } catch (error) {
        console.error("Error mengambil tahun:", error);
        // Jika terjadi error, gunakan tahun saat ini
        const currentYear = new Date().getFullYear().toString();
        setAvailableYears([currentYear]);
        setYear(currentYear);
      } finally {
        setIsLoading(false);
      }
    };

    getYears();
  }, [fetchYears, setYear]);

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
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

        <div className="flex items-center gap-2">
          <Label htmlFor="tahun" className="text-sm whitespace-nowrap">
            Tahun:
          </Label>
          <Select 
            value={year} 
            onValueChange={setYear}
            disabled={isLoading || availableYears.length === 0}
          >
            <SelectTrigger id="tahun" className="w-24 h-9">
              <SelectValue placeholder={isLoading ? "Memuat..." : "Tahun"} />
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
      </div>
    </div>
  );
}
