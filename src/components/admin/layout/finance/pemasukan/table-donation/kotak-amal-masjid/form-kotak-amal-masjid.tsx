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
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import { formatNumber, unformatNumber } from "../utils";
import { createKotakAmal } from "@/lib/services/supabase/kotak-amal-masjid";

interface KotakAmalMasjidFormValues {
  tanggal: Date;
  jumlah: number;
}

interface FormKotakAmalMasjidProps {
  onSuccess: () => void;
}

export function FormKotakAmalMasjid({ onSuccess }: FormKotakAmalMasjidProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<KotakAmalMasjidFormValues>({
    defaultValues: {
      tanggal: new Date(),
      jumlah: 0,
    },
  });

  const onSubmit = async (data: KotakAmalMasjidFormValues) => {
    setIsSubmitting(true);
    try {
      const tahun = data.tanggal.getFullYear();
      await createKotakAmal({
        tanggal: format(data.tanggal, "yyyy-MM-dd"),
        jumlah: data.jumlah,
        tahun,
      });

      await Swal.fire({
        title: "Berhasil!",
        text: "Data kotak amal masjid berhasil disimpan",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: "#10B981",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data kotak amal masjid:", error);
      await Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data kotak amal masjid",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-[440px]">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
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
                <FormLabel className="text-base">Jumlah (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-11"
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

        <DialogFooter className="mt-8">
          <Button className="text-white h-8 px-4" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}