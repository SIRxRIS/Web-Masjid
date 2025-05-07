"use client";

import { IconTrendingDown, IconTrendingUp, IconEqual } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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

interface AnimatedNumberProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber = ({ value, prefix = "", suffix = "", className = "" }: AnimatedNumberProps) => {
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
        duration: 0.8
      }}
    >
      {prefix}{typeof value === 'number' ? value.toLocaleString('id-ID') : value}{suffix}
    </motion.span>
  );
};

export function SectionCards() {
  const [dashboardData, setDashboardData] = useState({
    saldo: 0,
    pertumbuhanDanaBulanan: 0,
    jumlahDonatur: 0,
    pertumbuhanDonatur: 0,
    totalKontenPublished: 0,
    pertumbuhanDanaTahunan: 0,
    totalGabunganKotakAmal: 0,
    donasiBulanan: 0,
    pertumbuhanDonasi: 0,
    totalPengeluaran: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentDate = new Date();
        const data = await getDashboardData(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setDashboardData({
          saldo: data.saldo,
          pertumbuhanDanaBulanan: data.pertumbuhanDanaBulanan,
          jumlahDonatur: data.jumlahDonatur,
          pertumbuhanDonatur: data.pertumbuhanDonatur,
          totalKontenPublished: data.totalKontenPublished,
          pertumbuhanDanaTahunan: data.pertumbuhanDanaTahunan,
          totalGabunganKotakAmal: data.totalGabunganKotakAmal,
          donasiBulanan: data.donasiBulanan,
          pertumbuhanDonasi: data.pertumbuhanDonasi,
          totalPengeluaran: data.totalPengeluaran
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Animasi loading untuk skeleton
  const loadingVariants = {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Total Saldo */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Total Saldo</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp<AnimatedNumber value={dashboardData.saldo} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  {dashboardData.pertumbuhanDanaBulanan >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  <AnimatedNumber 
                    value={dashboardData.pertumbuhanDanaBulanan} 
                    prefix={dashboardData.pertumbuhanDanaBulanan >= 0 ? '+' : ''} 
                    suffix="%" 
                  />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Pertumbuhan Saldo {dashboardData.pertumbuhanDanaBulanan >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                </div>
                <div className="text-muted-foreground">Saldo dari bulan ke bulan</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Total Donatur */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Total Donatur</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <AnimatedNumber value={dashboardData.jumlahDonatur} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  {dashboardData.pertumbuhanDonatur >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  <AnimatedNumber 
                    value={dashboardData.pertumbuhanDonatur} 
                    prefix={dashboardData.pertumbuhanDonatur >= 0 ? '+' : ''} 
                    suffix="%" 
                  />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Pertumbuhan donatur {dashboardData.pertumbuhanDonatur >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                </div>
                <div className="text-muted-foreground">Donatur aktif bulan ini</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Konten Aktif */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Konten Aktif</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <AnimatedNumber value={dashboardData.totalKontenPublished} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  <IconTrendingUp />
                  <AnimatedNumber value={2} prefix="+" />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Konten bulan ini <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Program masjid aktif</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Total Kotak Amal */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Total Kotak Amal</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp<AnimatedNumber value={dashboardData.totalGabunganKotakAmal} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  <IconTrendingUp />
                  <AnimatedNumber value="8.2" prefix="+" suffix="%" />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Minggu ini <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Dari kotak amal Jumat</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Donasi Bulanan */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Donasi Bulanan</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp<AnimatedNumber value={dashboardData.donasiBulanan} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  {dashboardData.pertumbuhanDonasi >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  <AnimatedNumber 
                    value={dashboardData.pertumbuhanDonasi} 
                    prefix={dashboardData.pertumbuhanDonasi >= 0 ? '+' : ''} 
                    suffix="%" 
                  />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Donasi rutin {dashboardData.pertumbuhanDonasi >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                </div>
                <div className="text-muted-foreground">Donasi bulan ini</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Pengeluaran Terkini */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        layout
      >
        <Card className="@container/card h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Pengeluaran Terkini</CardDescription>
            {isLoading ? (
              <motion.div 
                className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-md" 
                variants={loadingVariants}
                initial="initial"
                animate="animate"
              />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp<AnimatedNumber value={dashboardData.totalPengeluaran} />
              </CardTitle>
            )}
            <CardAction>
              {isLoading ? (
                <motion.div 
                  className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" 
                  variants={loadingVariants}
                  initial="initial"
                  animate="animate"
                />
              ) : (
                <Badge variant="outline">
                  <IconTrendingDown />
                  <AnimatedNumber value="12.3" prefix="-" suffix="%" />
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Pengeluaran menurun <IconTrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">Dibanding bulan lalu</div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}

const getTrendingIcon = (value: number) => {
  if (value > 0) return <IconTrendingUp className="size-4" />;
  if (value < 0) return <IconTrendingDown className="size-4" />;
  return <IconEqual className="size-4" />;
};