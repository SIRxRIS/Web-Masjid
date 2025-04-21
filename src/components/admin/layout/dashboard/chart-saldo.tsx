"use client";

import { TrendingUp } from "lucide-react";
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
const chartData = [
  { month: "Januari", saldo: 186000000 },
  { month: "Februari", saldo: 305000000 },
  { month: "Maret", saldo: 237000000 },
  { month: "April", saldo: 173000000 },
  { month: "Mei", saldo: 209000000 },
  { month: "Juni", saldo: 214000000 },
  { month: "Juli", saldo: 245000000 },
  { month: "Agustus", saldo: 267000000 },
  { month: "September", saldo: 289000000 },
  { month: "Oktober", saldo: 312000000 },
  { month: "November", saldo: 334000000 },
  { month: "Desember", saldo: 356000000 },
];

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartSaldo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Saldo</CardTitle>
        <CardDescription>Januari - Desember 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[300px]" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            width={600}
            height={300}
            margin={{
              top: 20,
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="saldo" fill="var(--color-chart-1)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `Rp${value.toLocaleString('id-ID')}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Meningkat 5.2% bulan ini <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan total saldo 12 bulan terakhir
        </div>
      </CardFooter>
    </Card>
  );
}