// src/components/admin/layout/dashboard/chart-saldo.tsx
"use client";

import { useState } from "react";
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

// Konfigurasi chart
const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartSaldoProps {
  initialChartData: Array<{ month: string; saldo: number }>;
  initialPertumbuhan: number;
}

export function ChartSaldo({
  initialChartData,
  initialPertumbuhan,
}: ChartSaldoProps) {
  const [chartData] = useState(initialChartData);
  const [pertumbuhanPersentase] = useState(initialPertumbuhan);

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
                offset={15}
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
