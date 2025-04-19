"use client";

import * as React from "react";

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
  availableYears?: string[];
}

export function TableToolbar({
  searchQuery,
  setSearchQuery,
  placeholder = "Cari nama atau alamat...",
  year,
  setYear,
  availableYears = ["2023", "2024", "2025"],
}: TableToolbarProps) {
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
      </div>
    </div>
  );
}
