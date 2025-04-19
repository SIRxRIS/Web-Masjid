"use client";

// Remove these unused imports
// import { Table, TableBody, TableHeader } from "@/components/ui/table";

import * as React from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Local imports
import { columns } from "./columns";
import { type DonaturData } from "./schema";
import { TableToolbar } from "./table-toolbar";
import { TableViewTabs } from "./table-view-tabs";
import { TablePagination } from "./table-pagination";
import { DataTableTabsContent } from "./data-table-tabs-content";
import { Tabs } from "@/components/ui/tabs";

export function DataTable({ data: initialData }: { data: DonaturData[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  // Apply search filter
  React.useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = initialData.filter(
        (item) =>
          item.nama.toLowerCase().includes(lowerQuery) ||
          item.alamat.toLowerCase().includes(lowerQuery)
      );
      setData(filtered);
    } else {
      setData(initialData);
    }
  }, [searchQuery, initialData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Calculate summaries
  const totalDonations = React.useMemo(() => {
    return data.reduce((sum, item) => {
      const itemTotal = [
        item.jan,
        item.feb,
        item.mar,
        item.apr,
        item.mei,
        item.jun,
        item.jul,
        item.aug,
        item.sep,
        item.okt,
        item.nov,
        item.des,
        item.infaq,
      ].reduce((monthSum, value) => monthSum + value, 0);
      return sum + itemTotal;
    }, 0);
  }, [data]);

  const monthlyTotals = React.useMemo(() => {
    return {
      jan: data.reduce((sum, item) => sum + item.jan, 0),
      feb: data.reduce((sum, item) => sum + item.feb, 0),
      mar: data.reduce((sum, item) => sum + item.mar, 0),
      apr: data.reduce((sum, item) => sum + item.apr, 0),
      mei: data.reduce((sum, item) => sum + item.mei, 0),
      jun: data.reduce((sum, item) => sum + item.jun, 0),
      jul: data.reduce((sum, item) => sum + item.jul, 0),
      aug: data.reduce((sum, item) => sum + item.aug, 0),
      sep: data.reduce((sum, item) => sum + item.sep, 0),
      okt: data.reduce((sum, item) => sum + item.okt, 0),
      nov: data.reduce((sum, item) => sum + item.nov, 0),
      des: data.reduce((sum, item) => sum + item.des, 0),
      infaq: data.reduce((sum, item) => sum + item.infaq, 0),
    };
  }, [data]);

  return (
    <div className="w-full flex-col justify-start gap-6">
      <Tabs defaultValue="riwayat-tahunan">
        <TableViewTabs table={table} />

        <TableToolbar
          table={table}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <DataTableTabsContent
          table={table}
          dataIds={dataIds}
          handleDragEnd={handleDragEnd}
          sensors={sensors}
          sortableId={sortableId}
          monthlyTotals={monthlyTotals}
          totalDonations={totalDonations}
        />

        <TablePagination table={table} />
      </Tabs>
    </div>
  );
}
