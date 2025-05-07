"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getDonasiBulanan } from "@/lib/services/supabase/dashboard/actions"; 
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

export const description = "Grafik area interaktif donasi";

// Definisi interface untuk data donasi
interface DonasiData {
  date: string;
  desktop: number;
  mobile: number;
}

const chartConfig = {
  visitors: {
    label: "Pengunjung",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<DonasiData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fungsi untuk mengambil data donasi
  const fetchDonasiData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Ambil tahun saat ini untuk data donasi
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      // Buat array untuk menyimpan data 12 bulan terakhir
      const donasiData: DonasiData[] = [];
      
      // Loop untuk 12 bulan terakhir
      for (let i = 0; i < 12; i++) {
        // Hitung bulan yang sesuai (mundur dari bulan sekarang)
        const targetDate = new Date(currentDate);
        targetDate.setMonth(targetDate.getMonth() - i);
        
        const targetYear = targetDate.getFullYear();
        const targetMonth = targetDate.getMonth() + 1; // getMonth() returns 0-11
        
        // Format tanggal untuk chart
        const formattedDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        
        // Ambil data donasi untuk bulan tersebut
        const donasiDesktop = await getDonasiBulanan(targetYear, targetMonth);
        
        // Asumsikan 40% donasi dari mobile dan 60% dari desktop (atau sesuaikan berdasarkan kebutuhan)
        const donasiMobile = Math.round(donasiDesktop * 0.4);
        const donasiDesktopOnly = Math.round(donasiDesktop * 0.6);
        
        // Tambahkan data ke array
        donasiData.push({
          date: formattedDate,
          desktop: donasiDesktopOnly,
          mobile: donasiMobile
        });
      }
      
      // Urutkan data berdasarkan tanggal (terlama ke terbaru)
      donasiData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setChartData(donasiData);
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data donasi:", error);
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDonasiData();
  }, [fetchDonasiData]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // Gunakan tanggal hari ini sebagai referensi
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Donasi</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total untuk 3 bulan terakhir
          </span>
          <span className="@[540px]/card:hidden">3 bulan terakhir</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 bulan terakhir</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari terakhir</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 hari terakhir</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Pilih nilai"
            >
              <SelectValue placeholder="3 bulan terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 bulan terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 hari terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <p>Memuat data...</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : filteredData.length > 10 ? 10 : filteredData.length - 1}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value: ValueType, name: NameType) => {
                      if (typeof value === 'number') {
                        return new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(value);
                      }
                      return String(value);
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
                name="Mobile"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
                name="Desktop"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}