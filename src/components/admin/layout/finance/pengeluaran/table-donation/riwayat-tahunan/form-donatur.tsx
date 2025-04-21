import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { formatNumber, unformatNumber } from "../../../pemasukan/table-donation/utils";

interface DonaturFormValues {
  nama: string;
  alamat: string;
  jumlah: number;
  bulan: string;
}

const bulanOptions = [
  { value: "jan", label: "Januari" },
  { value: "feb", label: "Februari" },
  { value: "mar", label: "Maret" },
  { value: "apr", label: "April" },
  { value: "mei", label: "Mei" },
  { value: "jun", label: "Juni" },
  { value: "jul", label: "Juli" },
  { value: "aug", label: "Agustus" },
  { value: "sep", label: "September" },
  { value: "okt", label: "Oktober" },
  { value: "nov", label: "November" },
  { value: "des", label: "Desember" },
];

interface FormDonaturRutinProps {
  onSuccess: () => void;
}

export function FormDonaturRutin({ onSuccess }: FormDonaturRutinProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<DonaturFormValues>({
    defaultValues: {
      nama: "",
      alamat: "",
      jumlah: 0,
      bulan: "jan",
    },
  });

  const onSubmit = async (data: DonaturFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: lastDonatur, error: countError } = await supabase
        .from("Donatur")
        .select("no")
        .order("no", { ascending: false })
        .limit(1);

      const nextNo =
        lastDonatur && lastDonatur.length > 0 ? lastDonatur[0].no + 1 : 1;
      const donaturData = {
        no: nextNo,
        nama: data.nama,
        alamat: data.alamat,
        [data.bulan]: data.jumlah,
      };
      const { error } = await supabase.from("Donatur").insert(donaturData);

      if (error) throw error;

      await Swal.fire({
        title: "Berhasil!",
        text: "Data donatur berhasil disimpan",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: '#10B981',
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data donatur:", error);
      await Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data donatur",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Donatur</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama donatur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan alamat donatur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bulan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bulan</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      {...field}
                    >
                      {bulanOptions.map((bulan) => (
                        <option key={bulan.value} value={bulan.value}>
                          {bulan.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="0"
                      value={formatNumber(field.value.toString())}
                      onChange={(e) => {
                        const value = unformatNumber(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button className="text-white" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
