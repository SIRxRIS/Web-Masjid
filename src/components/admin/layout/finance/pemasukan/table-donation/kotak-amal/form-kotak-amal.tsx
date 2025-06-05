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
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import {
  formatNumber,
  unformatNumber,
} from "../../../pemasukan/table-donation/utils";

interface KotakAmalFormValues {
  nama: string;
  lokasi: string;
  jumlah: number;
  bulan: string;
  tahun: number;
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

interface FormKotakAmalProps {
  onSuccess: () => void;
}

export function FormKotakAmal({ onSuccess }: FormKotakAmalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<KotakAmalFormValues>({
    defaultValues: {
      nama: "",
      lokasi: "",
      jumlah: 0,
      bulan: "jan",
      tahun: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: KotakAmalFormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: lastKotakAmal, error: countError } = await supabase
        .from("KotakAmal")
        .select("no")
        .order("no", { ascending: false })
        .limit(1);

      const nextNo =
        lastKotakAmal && lastKotakAmal.length > 0 ? lastKotakAmal[0].no + 1 : 1;
      const kotakAmalData = {
        no: nextNo,
        nama: data.nama,
        lokasi: data.lokasi,
        tahun: data.tahun,
        [data.bulan]: data.jumlah,
      };

      const { error } = await supabase.from("KotakAmal").insert(kotakAmalData);

      if (error) throw error;

      await Swal.fire({
        title: "Berhasil!",
        text: "Data kotak amal berhasil disimpan",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: "#10B981",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data kotak amal:", error);
      await Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data kotak amal",
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
                <FormLabel>Nama Kotak Amal</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama kotak amal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lokasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan lokasi kotak amal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tahun"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan tahun"
                      min={2000}
                      max={2100}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

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
                    value={
                      field.value ? formatNumber(field.value.toString()) : ""
                    }
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

        <DialogFooter className="mt-6">
          <Button className="text-white" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
