"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DonaturData } from "@/components/layout/finance/pemasukan/table-donation/schema";

interface DetailDonaturProps {
  isOpen: boolean;
  onClose: () => void;
  donatur: DonaturData | null;
}

interface MonthlyDonation {
  no: number;
  bulan: string;
  donasi: string;
  infaq: string;
}

export function DetailDonatur({
  isOpen,
  onClose,
  donatur,
}: DetailDonaturProps) {
  if (!donatur) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const totalDonasi = React.useMemo(() => {
    return (
      donatur.jan +
      donatur.feb +
      donatur.mar +
      donatur.apr +
      donatur.mei +
      donatur.jun +
      donatur.jul +
      donatur.aug +
      donatur.sep +
      donatur.okt +
      donatur.nov +
      donatur.des
    );
  }, [donatur]);

  const monthlyDonations: MonthlyDonation[] = [
    {
      no: 1,
      bulan: "Januari",
      donasi: formatCurrency(donatur.jan),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 2,
      bulan: "Februari",
      donasi: formatCurrency(donatur.feb),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 3,
      bulan: "Maret",
      donasi: formatCurrency(donatur.mar),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 4,
      bulan: "April",
      donasi: formatCurrency(donatur.apr),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 5,
      bulan: "Mei",
      donasi: formatCurrency(donatur.mei),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 6,
      bulan: "Juni",
      donasi: formatCurrency(donatur.jun),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 7,
      bulan: "Juli",
      donasi: formatCurrency(donatur.jul),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 8,
      bulan: "Agustus",
      donasi: formatCurrency(donatur.aug),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 9,
      bulan: "September",
      donasi: formatCurrency(donatur.sep),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 10,
      bulan: "Oktober",
      donasi: formatCurrency(donatur.okt),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 11,
      bulan: "November",
      donasi: formatCurrency(donatur.nov),
      infaq: formatCurrency(donatur.infaq),
    },
    {
      no: 12,
      bulan: "Desember",
      donasi: formatCurrency(donatur.des),
      infaq: formatCurrency(donatur.infaq),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold">
            Kartu Donatur Tetap 2025
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="font-semibold">Nama</div>
            <div className="col-span-3">: {donatur.nama || "-"}</div>

            <div className="font-semibold">Alamat</div>
            <div className="col-span-3">: {donatur.alamat || "-"}</div>

            <div className="font-semibold">Donasi</div>
            <div className="col-span-3">
              : Rp. {formatCurrency(totalDonasi)}
            </div>

            <div className="font-semibold">Infaq</div>
            <div className="col-span-3">
              : Rp. {formatCurrency(donatur.infaq)}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Donasi</TableHead>
                  <TableHead>Infaq</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyDonations.map((item) => (
                  <TableRow key={item.no}>
                    <TableCell className="text-center">{item.no}</TableCell>
                    <TableCell>{item.bulan}</TableCell>
                    <TableCell>{item.donasi}</TableCell>
                    <TableCell>{item.infaq}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-center mt-2 text-sm text-gray-600 italic">
            Semoga Menjadi Amal Shalih Yang Diridhai Allah SWT
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
