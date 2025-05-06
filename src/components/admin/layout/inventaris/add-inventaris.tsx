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
import { FormInventaris } from "./form/form-inventaris";
import { type InventarisData } from "./schema";

interface AddInventarisProps {
  onInventarisAdded?: (newData: InventarisData) => void;
}

export default function AddInventaris({ onInventarisAdded }: AddInventarisProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (newData?: InventarisData) => {
    setOpen(false);
    if (newData && onInventarisAdded) {
      onInventarisAdded(newData);
    }
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
          <DialogTitle>Tambah Inventaris Baru</DialogTitle>
          <DialogDescription>
            Isi form inventaris dengan lengkap.
          </DialogDescription>
        </DialogHeader>

        <FormInventaris onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
