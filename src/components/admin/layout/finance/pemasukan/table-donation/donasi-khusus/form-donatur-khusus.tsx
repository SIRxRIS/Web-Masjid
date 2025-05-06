import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale"; 
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { formatNumber, unformatNumber } from "../../../pemasukan/table-donation/utils";

interface DonasiKhususFormValues {
  nama: string;
  tanggal: Date;
  jumlah: number;
  keterangan: string;
}

interface FormDonasiKhususProps {
  onSuccess: () => void;
}

export function FormDonasiKhusus({ onSuccess }: FormDonasiKhususProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<DonasiKhususFormValues>({
    defaultValues: {
      nama: "",
      tanggal: new Date(),
      jumlah: 0,
      keterangan: "",
    },
  });

  const onSubmit = async (data: DonasiKhususFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: lastDonasiKhusus, error: countError } = await supabase
        .from("DonasiKhusus")
        .select("no")
        .order("no", { ascending: false })
        .limit(1);

      const nextNo =
        lastDonasiKhusus && lastDonasiKhusus.length > 0
          ? lastDonasiKhusus[0].no + 1
          : 1;

      const donasiKhususData = {
        no: nextNo,
        nama: data.nama,
        tanggal: format(data.tanggal, 'yyyy-MM-dd'),
        tahun: data.tanggal.getFullYear(), 
        jumlah: data.jumlah,
        keterangan: data.keterangan,
      };

      const { error } = await supabase
        .from("DonasiKhusus")
        .insert(donasiKhususData);

      if (error) throw error;

      await Swal.fire({
        title: "Berhasil!",
        text: "Data donasi khusus berhasil disimpan",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: '#10B981',
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data donasi khusus:", error);
      await Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data donasi khusus",
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
            name="tanggal"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Donasi</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
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

          <FormField
            control={form.control}
            name="keterangan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masukkan keterangan donasi"
                    {...field}
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