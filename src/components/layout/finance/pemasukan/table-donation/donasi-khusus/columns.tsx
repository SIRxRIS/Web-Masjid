import { ColumnDef } from "@tanstack/react-table";
import { DonasiKhususData } from "../schema";
import { formatCurrency } from "../utils";
import { TableActions } from "./table-actions";

interface ColumnOptions {
  onEdit?: (donasi: DonasiKhususData) => void;
  onViewDetail?: (donasi: DonasiKhususData) => void;
  onDelete?: (id: number) => void;
}

export const columns = ({
  onEdit,
  onViewDetail,
  onDelete,
}: ColumnOptions = {}): ColumnDef<DonasiKhususData>[] => [
  {
    accessorKey: "no",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("no")}</div>,
  },
  {
    accessorKey: "nama",
    header: () => <div className="text-center">Nama Donatur</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nama")}</div>
    ),
  },
  {
    accessorKey: "tanggal",
    header: () => <div className="text-center">Tanggal</div>,
    cell: ({ row }) => {
      const date = row.getValue("tanggal");
      const formattedDate = date instanceof Date ? date : new Date(date as string);
      return (
        <div className="text-center">
          {formattedDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "jumlah",
    header: () => <div className="text-center">Jumlah</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {formatCurrency(row.getValue("jumlah"))}
      </div>
    ),
  },
  {
    accessorKey: "keterangan",
    header: () => <div className="text-center">Keterangan</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("keterangan")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TableActions
        donasi={row.original}
        onEdit={onEdit}
        onViewDetail={onViewDetail}
        onDelete={onDelete}
      />
    ),
  },
];