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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase/supabase";

interface DeleteDonaturDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<boolean>;
  donaturName: string;
  donaturId: number;
}

export function DeleteDonaturDialog({
  isOpen,
  onClose,
  onConfirm,
  donaturName,
  donaturId,
}: DeleteDonaturDialogProps) {
  const handleConfirm = async () => {
    try {
      const { error } = await supabase
        .from("Donatur")
        .delete()
        .eq("id", donaturId);

      if (error) {
        console.error("Error deleting donatur:", error);
        Swal.fire({
          title: "Error!",
          text: "Gagal menghapus data donatur",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
      await onConfirm(donaturId);

      Swal.fire({
        title: "Terhapus!",
        text: "Data donatur berhasil dihapus",
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
          <AlertDialogTitle>Hapus Data Donatur</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data donatur{" "}
            <strong>{donaturName}</strong>? Tindakan ini tidak dapat dibatalkan.
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


interface DeleteKotakAmalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<boolean>;
  kotakAmalName: string;
  kotakAmalId: number;
}

export function DeleteKotakAmalDialog({
  isOpen,
  onClose,
  onConfirm,
  kotakAmalName,
  kotakAmalId,
}: DeleteKotakAmalDialogProps) {
  const handleConfirm = async () => {
    try {
      const { error } = await supabase
        .from("KotakAmal")
        .delete()
        .eq("id", kotakAmalId);

      if (error) {
        console.error("Error deleting kotak amal:", error);
        Swal.fire({
          title: "Error!",
          text: "Gagal menghapus data kotak amal",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
      await onConfirm(kotakAmalId);

      Swal.fire({
        title: "Terhapus!",
        text: "Data kotak amal berhasil dihapus",
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
          <AlertDialogTitle>Hapus Data Kotak Amal</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data kotak amal{" "}
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
