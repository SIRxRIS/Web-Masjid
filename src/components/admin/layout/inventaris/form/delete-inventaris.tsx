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
import { deleteInventaris } from "@/lib/services/supabase/inventaris/inventaris";

interface DeleteInventarisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<boolean>;
  inventarisName: string;
  inventarisId: number;
}

export function DeleteInventarisDialog({
  isOpen,
  onClose,
  onConfirm,
  inventarisName,
  inventarisId,
}: DeleteInventarisDialogProps) {
  const handleConfirm = async () => {
    try {
      // Menggunakan fungsi deleteInventaris dari service
      await deleteInventaris(inventarisId);
      
      await onConfirm(inventarisId);

      Swal.fire({
        title: "Terhapus!",
        text: "Data inventaris berhasil dihapus",
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
          <AlertDialogTitle>Hapus Data Inventaris</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus inventaris{" "}
            <strong>{inventarisName}</strong>? Tindakan ini tidak dapat dibatalkan.
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