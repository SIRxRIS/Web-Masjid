"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase/supabase";
import { deleteKotakAmal } from "@/lib/services/supabase/kotak-amal-masjid";

interface DeleteKotakAmalMasjidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  kotakAmalName: string;
  kotakAmalId: number;
}

export function DeleteKotakAmalMasjidDialog({
  isOpen,
  onClose,
  onConfirm,
  kotakAmalName,
  kotakAmalId,
}: DeleteKotakAmalMasjidDialogProps) {
  const handleConfirm = async () => {
    try {
      await deleteKotakAmal(kotakAmalId);

      await onConfirm(kotakAmalId);
      Swal.fire({
        title: "Terhapus!",
        text: "Data kotak amal masjid berhasil dihapus",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      onClose();
    } catch (err) {
      console.error("Error in handleConfirm:", err);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menghapus data",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Kotak Amal Masjid</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data kotak amal masjid tanggal{" "}
            <strong>{kotakAmalName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}