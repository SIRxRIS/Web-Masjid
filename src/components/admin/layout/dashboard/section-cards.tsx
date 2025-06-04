// src/components/admin/layout/dashboard/section-cards.tsx
"use client";

import {
  IconTrendingDown,
  IconTrendingUp,
  IconEqual,
} from "@tabler/icons-react";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/services/supabase/dashboard/dashboard";
import { motion } from "framer-motion";

interface DashboardData {
  saldo: number;
  pertumbuhanDanaBulanan: number;
  jumlahDonatur: number;
  pertumbuhanDonatur: number;
  totalKontenPublished: number;
  pertumbuhanDanaTahunan: number;
  totalGabunganKotakAmal: number;
  donasiBulanan: number;
  pertumbuhanDonasi: number;
  totalPengeluaran: number;
}

interface AnimatedNumberProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.8,
      }}
    >
      {prefix}
      {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      {suffix}
    </motion.span>
  );
};

// Loading Skeleton Component
const CardSkeleton = () => {
  const loadingVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Card className="@container/card h-full overflow-hidden">
      <CardHeader>
        <motion.div
          className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        <motion.div
          className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded-md"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-md"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        />
      </CardFooter>
    </Card>
  );
};

// Helper function untuk mendapatkan icon trending
const getTrendingIcon = (value: number) => {
  if (value > 0) return <IconTrendingUp className="size-4" />;
  if (value < 0) return <IconTrendingDown className="size-4" />;
  return <IconEqual className="size-4" />;
};

// Helper function untuk format mata uang
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp");
};

export function SectionCards() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    saldo: 0,
    pertumbuhanDanaBulanan: 0,
    jumlahDonatur: 0,
    pertumbuhanDonatur: 0,
    totalKontenPublished: 0,
    pertumbuhanDanaTahunan: 0,
    totalGabunganKotakAmal: 0,
    donasiBulanan: 0,
    pertumbuhanDonasi: 0,
    totalPengeluaran: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentDate = new Date();
      const data = await getDashboardData(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Data kartu dengan konfigurasi dinamis
  const cardConfigs = [
    {
      id: "saldo",
      title: "Total Saldo",
      value: dashboardData.saldo,
      growth: dashboardData.pertumbuhanDanaBulanan,
      prefix: "Rp",
      description: "Pertumbuhan Saldo",
      subtitle: "Saldo dari bulan ke bulan",
      isGrowthPositive: dashboardData.pertumbuhanDanaBulanan >= 0,
    },
    {
      id: "donatur",
      title: "Total Donatur",
      value: dashboardData.jumlahDonatur,
      growth: dashboardData.pertumbuhanDonatur,
      description: "Pertumbuhan donatur",
      subtitle: "Donatur aktif bulan ini",
      isGrowthPositive: dashboardData.pertumbuhanDonatur >= 0,
    },
    {
      id: "konten",
      title: "Konten Aktif",
      value: dashboardData.totalKontenPublished,
      growth: 2, // Static value as in original
      description: "Konten bulan ini",
      subtitle: "Program masjid aktif",
      isGrowthPositive: true,
    },
    {
      id: "kotak-amal",
      title: "Total Kotak Amal",
      value: dashboardData.totalGabunganKotakAmal,
      growth: 8.2, // Static value as in original
      prefix: "Rp",
      description: "Minggu ini",
      subtitle: "Dari kotak amal Jumat",
      isGrowthPositive: true,
    },
    {
      id: "donasi-bulanan",
      title: "Donasi Bulanan",
      value: dashboardData.donasiBulanan,
      growth: dashboardData.pertumbuhanDonasi,
      prefix: "Rp",
      description: "Donasi rutin",
      subtitle: "Donasi bulan ini",
      isGrowthPositive: dashboardData.pertumbuhanDonasi >= 0,
    },
    {
      id: "pengeluaran",
      title: "Pengeluaran Terkini",
      value: dashboardData.totalPengeluaran,
      growth: -12.3, // Static negative value as in original
      prefix: "Rp",
      description: "Pengeluaran menurun",
      subtitle: "Dibanding bulan lalu",
      isGrowthPositive: false,
    },
  ];

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Coba Lagi
          </button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cardConfigs.map((config) => (
        <motion.div
          key={config.id}
          variants={cardVariants}
          whileHover="hover"
          layout
        >
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <Card className="@container/card h-full overflow-hidden">
              <CardHeader>
                <CardDescription>{config.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {config.prefix && config.prefix}
                  <AnimatedNumber value={config.value} />
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    {getTrendingIcon(config.growth)}
                    <AnimatedNumber
                      value={config.growth}
                      prefix={config.growth >= 0 ? "+" : ""}
                      suffix="%"
                    />
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {config.description} {getTrendingIcon(config.growth)}
                </div>
                <div className="text-muted-foreground">{config.subtitle}</div>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
