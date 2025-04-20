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
import { DetailDonatur } from "./detail-donatur";
import { EditDonatur } from "./edit-donatur";

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

  const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data]);

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedDonatur, setSelectedDonatur] =
    React.useState<DonaturData | null>(null);

  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const handleViewDetail = (donatur: DonaturData) => {
    setSelectedDonatur(donatur);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDonatur(null);
  };

  const handleEdit = (donatur: DonaturData) => {
    setSelectedDonatur(donatur);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedDonatur(null);
  };

  const handleSaveEdit = (updatedDonatur: DonaturData) => {
    setData((prevData) => {
      return prevData.map((item) => {
        if (item.id === updatedDonatur.id) {
          return updatedDonatur;
        }
        return item;
      });
    });
  };

  const handleDelete = (donaturId: number) => {
    const filteredData = data.filter((item) => item.id !== donaturId);

    const updatedData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));

    setData(updatedData);
  };

  const table = useReactTable({
    data,
    columns: columns({
      onViewDetail: handleViewDetail,
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
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
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);

        const reorderedData = arrayMove(data, oldIndex, newIndex);

        return reorderedData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
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
                <TableRow className="bg-muted font-medium sticky bottom-0 border-t-2 ">
                  {/* Kolom No, Nama dan Alamat */}
                  <TableCell className="text-right font-bold px-4 py-3">
                    Total:
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  
                  {/* Bulan Januari sampai Desember */}
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.jan)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.feb)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.mar)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.apr)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.mei)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.jun)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.jul)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.aug)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.sep)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.okt)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.nov)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.des)}
                  </TableCell>
                  
                  {/* Infaq dan Total */}
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(monthlyTotals.infaq)}
                  </TableCell>
                  <TableCell className="text-center font-bold px-4 py-3">
                    {formatCurrency(totalDonations)}
                  </TableCell>
                  
                  {/* Kolom Aksi */}
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <TablePagination table={table} />

      {/* Detail Donatur Dialog */}
      <DetailDonatur
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        donatur={selectedDonatur}
      />

      {/* Edit Donatur Dialog */}
      <EditDonatur
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        donatur={selectedDonatur}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TableRiwayatTahunan;
