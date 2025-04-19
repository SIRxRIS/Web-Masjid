"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DonaturData } from "./schema";
import { DragHandle } from "./drag-handle";
import { formatCurrency } from "./utils";

// Table columns definition
export const columns: ColumnDef<DonaturData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "no",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => <div className="text-center">{row.original.no}</div>,
    size: 50,
  },
  {
    accessorKey: "nama",
    header: () => <div className="text-center">Nama</div>,
    cell: ({ row }) => <div>{row.original.nama}</div>,
    size: 200,
  },
  {
    accessorKey: "alamat",
    header: () => <div className="text-center">Alamat</div>,
    cell: ({ row }) => <div>{row.original.alamat}</div>,
    size: 300,
  },
  {
    accessorKey: "jan",
    header: () => <div className="text-center">Jan</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.jan)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "feb",
    header: () => <div className="text-center">Feb</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.feb)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "mar",
    header: () => <div className="text-center">Mar</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.mar)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "apr",
    header: () => <div className="text-center">Apr</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.apr)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "mei",
    header: () => <div className="text-center">Mei</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.mei)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "jun",
    header: () => <div className="text-center">Jun</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.jun)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "jul",
    header: () => <div className="text-center">Jul</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.jul)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "aug",
    header: () => <div className="text-center">Agust</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.aug)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "sep",
    header: () => <div className="text-center">Sept</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.sep)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "okt",
    header: () => <div className="text-center">Okt</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.okt)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "nov",
    header: () => <div className="text-center">Nov</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.nov)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "des",
    header: () => <div className="text-center">Des</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.des)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "infaq",
    header: () => <div className="text-center">Infaq</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatCurrency(row.original.infaq)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "jumlah",
    header: () => <div className="text-center">Jumlah</div>,
    cell: ({ row }) => {
      const total = [
        row.original.jan,
        row.original.feb,
        row.original.mar,
        row.original.apr,
        row.original.mei,
        row.original.jun,
        row.original.jul,
        row.original.aug,
        row.original.sep,
        row.original.okt,
        row.original.nov,
        row.original.des,
        row.original.infaq,
      ].reduce((sum, value) => sum + value, 0);

      return (
        <div className="text-center font-medium">{formatCurrency(total)}</div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Hapus</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
