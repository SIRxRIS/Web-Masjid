"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DonaturData } from "./schema";

interface TableToolbarProps {
  table: Table<DonaturData>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function TableToolbar({
  searchQuery,
  setSearchQuery,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Search and Year Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Cari Donatur
          </Label>
          <Input
            id="search"
            placeholder="Cari nama atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 max-w-[320px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="tahun" className="text-sm whitespace-nowrap">
            Tahun:
          </Label>
          <Select defaultValue="2025">
            <SelectTrigger id="tahun" className="w-24 h-9">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
