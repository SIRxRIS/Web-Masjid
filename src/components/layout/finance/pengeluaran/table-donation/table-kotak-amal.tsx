"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { formatCurrency } from "./utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DraggableRow } from "./draggable-row";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";

export const schema = z.object({
  id: z.number(),
  no: z.number(),
  nama: z.string(),
  lokasi: z.string(),
  jan: z.number(),
  feb: z.number(),
  mar: z.number(),
  apr: z.number(),
  mei: z.number(),
  jun: z.number(),
  jul: z.number(),
  aug: z.number(),
  sep: z.number(),
  okt: z.number(),
  nov: z.number(),
  des: z.number(),
});

// Update DonationData type
export type DonationData = z.infer<typeof schema>;

// Update the columns definition
export const columns: ColumnDef<DonationData>[] = [
  {
    accessorKey: "no",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("no")}</div>,
  },
  {
    accessorKey: "nama",
    header: () => <div className="text-center">Nama Kotak Amal</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nama")}</div>
    ),
  },
  {
    accessorKey: "lokasi",
    header: () => <div className="text-center">Lokasi</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("lokasi")}</div>
    ),
  },
  {
    accessorKey: "jan",
    header: () => <div className="text-center">Jan</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("jan"))}</div>
    ),
  },
  {
    accessorKey: "feb",
    header: () => <div className="text-center">Feb</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("feb"))}</div>
    ),
  },
  {
    accessorKey: "mar",
    header: () => <div className="text-center">Mar</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("mar"))}</div>
    ),
  },
  {
    accessorKey: "apr",
    header: () => <div className="text-center">Apr</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("apr"))}</div>
    ),
  },
  {
    accessorKey: "mei",
    header: () => <div className="text-center">Mei</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("mei"))}</div>
    ),
  },
  {
    accessorKey: "jun",
    header: () => <div className="text-center">Jun</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("jun"))}</div>
    ),
  },
  {
    accessorKey: "jul",
    header: () => <div className="text-center">Jul</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("jul"))}</div>
    ),
  },
  {
    accessorKey: "aug",
    header: () => <div className="text-center">Agust</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("aug"))}</div>
    ),
  },
  {
    accessorKey: "sep",
    header: () => <div className="text-center">Sept</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("sep"))}</div>
    ),
  },
  {
    accessorKey: "okt",
    header: () => <div className="text-center">Okt</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("okt"))}</div>
    ),
  },
  {
    accessorKey: "nov",
    header: () => <div className="text-center">Nov</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("nov"))}</div>
    ),
  },
  {
    accessorKey: "des",
    header: () => <div className="text-center">Des</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("des"))}</div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex justify-end">
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
      </div>
    ),
  },
];

interface DataTableProps {
  data: DonationData[];
}

export function DataTable({ data }: DataTableProps) {
  const [items, setItems] = React.useState(data);
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => items.map(({ id }) => id),
    [items]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      setItems(newItems);
    }
  }

  // Single totalDonations calculation (this is correct)
  const totalDonations = React.useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        item.jan +
        item.feb +
        item.mar +
        item.apr +
        item.mei +
        item.jun +
        item.jul +
        item.aug +
        item.sep +
        item.okt +
        item.nov +
        item.des,
      0
    );
  }, [items]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data donasi.
                </TableCell>
              </TableRow>
            )}

            {/* Summary row */}
            {table.getRowModel().rows?.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-right border-t bg-muted/50 font-medium"
                >
                  Total:
                </TableCell>
                <TableCell className="text-center border-t bg-muted/50 font-medium">
                  {formatCurrency(totalDonations)}
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="border-t bg-muted/50"
                ></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
