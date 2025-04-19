"use client";

import * as React from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DndContext,
  type DragEndEvent,
  type UniqueIdentifier,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
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
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { type DonaturData } from "../schema";
import { TablePagination } from "./table-pagination";
import { DraggableRow } from "../draggable-row";
import { formatCurrency } from "../utils";
import { DetailDonatur } from "../../detail-donatur";

interface TableRiwayatTahunanProps {
  data: DonaturData[];
  year: string;
}

export function TableRiwayatTahunan({
  data: initialData,
  year,
}: TableRiwayatTahunanProps) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

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

  // Add state for detail dialog
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedDonatur, setSelectedDonatur] = React.useState<DonaturData | null>(null);
  
  // Add handler for viewing details
  const handleViewDetail = (donatur: DonaturData) => {
    setSelectedDonatur(donatur);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDonatur(null);
  };
  
  // Update table configuration
  const table = useReactTable({
    data,
    columns: columns({ onViewDetail: handleViewDetail }),
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

  const totalDonations = React.useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, value) => sum + value, 0);
  }, [monthlyTotals]);

  return (
    <div className="w-full flex-col space-y-4">
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <TablePagination table={table} />

      <DetailDonatur 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        donatur={selectedDonatur}
      />
    </div>
  );
}

export default TableRiwayatTahunan;
