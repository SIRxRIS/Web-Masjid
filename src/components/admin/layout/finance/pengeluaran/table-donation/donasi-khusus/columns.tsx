import { ColumnDef } from "@tanstack/react-table";
import { DonasiKhususData } from "../schema";
import { formatCurrency } from "../../../pemasukan/table-donation/utils";
import { TableActions } from "./table-actions";
import { format, isValid } from "date-fns";
import { id } from "date-fns/locale"; // Impor yang benar

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
      // Perbaikan penanganan tanggal
      try {
        const dateValue = row.getValue("tanggal");
        // Pastikan kita mendapatkan objek Date yang valid
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue as string);
        
        if (!isValid(date)) {
          return <div className="text-center">Format tanggal tidak valid</div>;
        }
        
        return (
          <div className="text-center">
            {format(date, "dd MMMM yyyy", { locale: id })}
          </div>
        );
      } catch (error) {
        console.error("Error formatting date:", error);
        return <div className="text-center">Format tanggal tidak valid</div>;
      }
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