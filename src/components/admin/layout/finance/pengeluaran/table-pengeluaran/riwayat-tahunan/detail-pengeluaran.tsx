"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PengeluaranData } from "../schema";
import { formatCurrency } from "../../../pemasukan/table-donation/utils";
import { Button } from "@/components/ui/button";

interface DetailPengeluaranProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: number;
    no: number;
    nama: string;
    tanggal: Date;
    jumlah: number;
    createdAt: Date;
    updatedAt: Date;
    keterangan?: string;
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    mei?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    okt?: number;
    nov?: number;
    des?: number;
  } | null;
  year: string;
}

export function DetailPengeluaran({
  isOpen,
  onClose,
  data,
  year,
}: DetailPengeluaranProps) {
  if (!data) return null;

  const months = [
    { name: "Januari", key: "jan" },
    { name: "Februari", key: "feb" },
    { name: "Maret", key: "mar" },
    { name: "April", key: "apr" },
    { name: "Mei", key: "mei" },
    { name: "Juni", key: "jun" },
    { name: "Juli", key: "jul" },
    { name: "Agustus", key: "aug" },
    { name: "September", key: "sep" },
    { name: "Oktober", key: "okt" },
    { name: "November", key: "nov" },
    { name: "Desember", key: "des" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold">
            Detail Pengeluaran {year}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="font-semibold">Nama</div>
            <div className="col-span-3">: {data.nama || "-"}</div>

            <div className="font-semibold">Total</div>
            <div className="col-span-3">
              : {formatCurrency(data.jumlah)}
            </div>

            <div className="font-semibold">Keterangan</div>
            <div className="col-span-3">: {data.keterangan || "-"}</div>
          </div>

          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-semibold mb-2">Pengeluaran Bulanan</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {months.map((month) => {
                  // Try to get the monthly amount
                  const amount = data[month.key as keyof PengeluaranData] as number || 0;
                  return (
                    <TableRow key={month.key}>
                      <TableCell>{month.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600 italic">
            Dana ini telah digunakan untuk keperluan masjid
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}