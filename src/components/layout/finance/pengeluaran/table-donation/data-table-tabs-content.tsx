"use client";

import * as React from "react";
import {
  type UniqueIdentifier,
  DndContext,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { DraggableRow } from "./draggable-row";
import { columns } from "./columns";
import { formatCurrency } from "./utils";
import { type DonaturData } from "./schema";
import { DataTable } from "./table-donation-primary";
import donasiKhususData from "@/components/admin/finance/pengeluaran/donation-records.json";
import { DataTable as KotakAmalTable } from "./table-kotak-amal";
import kotakAmalData from "@/components/admin/finance/pengeluaran/data-kotak-amal.json";

interface MonthlyTotals {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
  infaq: number;
}

interface DataTableTabsContentProps {
  table: TableType<DonaturData>; 
  dataIds: UniqueIdentifier[];
  handleDragEnd: (event: DragEndEvent) => void;
  sensors: any; 
  sortableId: string;
  monthlyTotals: MonthlyTotals;
  totalDonations: number;
}

export function DataTableTabsContent({
  table,
  dataIds,
  handleDragEnd,
  sensors,
  sortableId,
  monthlyTotals,
  totalDonations,
}: DataTableTabsContentProps) {
  const renderDragTable = () => (
    <div className="overflow-x-auto rounded-lg border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                {table.getRowModel().rows.map((row: any) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data donatur.
                </TableCell>
              </TableRow>
            )}

            {/* Summary row */}
            {table.getRowModel().rows?.length > 0 && (
              <TableRow className="font-medium bg-muted/50">
                <TableCell colSpan={5} className="text-right">
                  Total:
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.jan)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.feb)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.mar)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.apr)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.mei)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.jun)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.jul)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.aug)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.sep)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.okt)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.nov)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.des)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(monthlyTotals.infaq)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalDonations)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );

  // Helper function to create empty placeholder content
  const renderPlaceholder = (message: string) => (
    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
      {message}
    </div>
  );

  return (
    <>
      <TabsContent
        value="donatur"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {renderDragTable()}
      </TabsContent>

      <TabsContent value="donasi" className="flex flex-col px-4 lg:px-6">
        {renderPlaceholder("Fitur Riwayat Donasi dalam pengembangan")}
      </TabsContent>

      <TabsContent
        value="riwayat-tahunan"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {renderDragTable()}
      </TabsContent>

      <TabsContent value="donasi-khusus" className="flex flex-col px-4 lg:px-6">
        <DataTable data={donasiKhususData} />
      </TabsContent>

      <TabsContent value="kotak-amal" className="flex flex-col px-4 lg:px-6">
        <KotakAmalTable data={kotakAmalData} />
      </TabsContent>

      <TabsContent value="rekap" className="flex flex-col px-4 lg:px-6">
        {renderPlaceholder("Fitur Rekap Bulanan dalam pengembangan")}
      </TabsContent>
    </>
  );
}
