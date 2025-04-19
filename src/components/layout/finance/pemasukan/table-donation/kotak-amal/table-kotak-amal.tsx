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
import { formatCurrency } from "../utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DraggableRow } from "../draggable-row";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { kotakAmalSchema, type KotakAmalData } from "../schema";

export const columns: ColumnDef<KotakAmalData>[] = [
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
    id: "jumlah",
    header: () => <div className="text-center font-medium">Jumlah</div>,
    cell: ({ row }) => {
      const rowSum =
        (row.getValue("jan") as number) +
        (row.getValue("feb") as number) +
        (row.getValue("mar") as number) +
        (row.getValue("apr") as number) +
        (row.getValue("mei") as number) +
        (row.getValue("jun") as number) +
        (row.getValue("jul") as number) +
        (row.getValue("aug") as number) +
        (row.getValue("sep") as number) +
        (row.getValue("okt") as number) +
        (row.getValue("nov") as number) +
        (row.getValue("des") as number);

      return (
        <div className="text-right font-medium">{formatCurrency(rowSum)}</div>
      );
    },
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
  data: KotakAmalData[];
  year: string;  // Add this prop
}

export function DataTable({ data, year }: DataTableProps) {
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

  const monthlyTotals = React.useMemo(() => {
    return items.reduce(
      (totals, item) => ({
        jan: totals.jan + item.jan,
        feb: totals.feb + item.feb,
        mar: totals.mar + item.mar,
        apr: totals.apr + item.apr,
        mei: totals.mei + item.mei,
        jun: totals.jun + item.jun,
        jul: totals.jul + item.jul,
        aug: totals.aug + item.aug,
        sep: totals.sep + item.sep,
        okt: totals.okt + item.okt,
        nov: totals.nov + item.nov,
        des: totals.des + item.des,
      }),
      {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        mei: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        okt: 0,
        nov: 0,
        des: 0,
      }
    );
  }, [items]);

  const totalDonations = React.useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, value) => sum + value, 0);
  }, [monthlyTotals]);

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
            {table.getRowModel().rows?.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-right border-t bg-muted/50 font-medium"
                >
                  Total:
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.jan)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.feb)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.mar)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.apr)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.mei)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.jun)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.jul)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.aug)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.sep)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.okt)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.nov)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(monthlyTotals.des)}
                </TableCell>
                <TableCell className="text-right border-t bg-muted/50 font-medium">
                  {formatCurrency(totalDonations)}
                </TableCell>
                <TableCell className="border-t bg-muted/50"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
