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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { FormDonaturRutin } from "./table-donation/riwayat-tahunan/form-donatur";
import { FormDonasiKhusus } from "./table-donation/donasi-khusus/form-donatur-khusus";
import { FormKotakAmal } from "./table-donation/kotak-amal/form-kotak-amal";

export default function AddDonation() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("donatur-rutin");

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
          <DialogTitle>Tambah Donasi Baru</DialogTitle>
          <DialogDescription>
            Pilih jenis donasi dan isi form yang sesuai.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="donatur-rutin">Donasi Rutin</TabsTrigger>
            <TabsTrigger value="donasi-khusus">Donasi Khusus</TabsTrigger>
            <TabsTrigger value="kotak-amal">Kotak Amal</TabsTrigger>
          </TabsList>

          {/* Form Donatur Rutin */}
          <TabsContent value="donatur-rutin">
            <FormDonaturRutin onSuccess={handleSuccess} />
          </TabsContent>

          {/* Form Donasi Khusus */}
          <TabsContent value="donasi-khusus">
            <FormDonasiKhusus onSuccess={handleSuccess} />
          </TabsContent>

          {/* Form Kotak Amal */}
          <TabsContent value="kotak-amal">
            <FormKotakAmal onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
