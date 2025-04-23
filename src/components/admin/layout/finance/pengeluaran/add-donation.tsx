import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { FormPengeluaran } from "./table-pengeluaran/table-pengeluaran-bulanan/form-pengeluaran";

export default function AddDonation() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("pengeluaran");

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4 mr-1 text-white" />
          <span className="font-bold text-white">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
          <DialogDescription>
            Isi form pengeluaran dengan lengkap.
          </DialogDescription>
        </DialogHeader>

        <FormPengeluaran onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
