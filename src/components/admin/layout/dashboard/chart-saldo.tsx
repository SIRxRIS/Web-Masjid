// src/components/admin/layout/dashboard/chart-saldo.tsx
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDonasiBulananAction } from "@/lib/services/supabase/dashboard/actions";

// Konfigurasi chart
const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartSaldo() {
  const [chartData, setChartData] = useState<
    Array<{ month: string; saldo: number }>
  >([]);
  const [pertumbuhanPersentase, setPertumbuhanPersentase] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tahunSekarang = new Date().getFullYear();
        const dataBulan = [];

        // Nama bulan dalam bahasa Indonesia
        const namaBulan = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];

        // Mengambil data donasi untuk setiap bulan
        for (let i = 1; i <= 12; i++) {
          const totalDonasi = await getDonasiBulananAction(tahunSekarang, i);
          dataBulan.push({
            month: namaBulan[i - 1],
            saldo: totalDonasi,
          });
        }

        setChartData(dataBulan);

        // Menghitung persentase pertumbuhan bulan ini
        const bulanIni = new Date().getMonth() + 1; // Bulan saat ini (1-12)

        if (bulanIni > 1) {
          const donasiSekarang = dataBulan[bulanIni - 1].saldo;
          const donasiSebelumnya = dataBulan[bulanIni - 2].saldo;

          const pertumbuhan =
            donasiSebelumnya === 0
              ? 100
              : parseFloat(
                  (
                    ((donasiSekarang - donasiSebelumnya) / donasiSebelumnya) *
                    100
                  ).toFixed(1)
                );

          setPertumbuhanPersentase(pertumbuhan);
        }
      } catch (error) {
        console.error("Error mengambil data donasi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grafik Saldo</CardTitle>
          <CardDescription>Memuat data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div>Sedang memuat data donasi...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Saldo</CardTitle>
        <CardDescription>
          Januari - Desember {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[300px]" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            width={600}
            height={300}
            margin={{
              top: 40,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="saldo" fill="var(--color-chart-1)" radius={8}>
              <LabelList
                position="top"
                offset={15} // Menambah jarak offset label
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) =>
                  `Rp${value.toLocaleString("id-ID")}`
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {pertumbuhanPersentase >= 0 ? (
            <>
              Meningkat {pertumbuhanPersentase}% bulan ini{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Menurun {Math.abs(pertumbuhanPersentase)}% bulan ini{" "}
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan total saldo {chartData.length} bulan terakhir
        </div>
      </CardFooter>
    </Card>
  );
}
