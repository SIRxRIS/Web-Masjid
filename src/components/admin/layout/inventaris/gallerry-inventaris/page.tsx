"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type InventarisData } from "../schema";
import { motion } from "framer-motion";

interface GalleryInventarisProps {
  inventarisData: InventarisData[];
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <motion.div
      className="relative aspect-square bg-gray-200"
      animate={{
        backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <CardFooter className="flex flex-col items-start gap-2 p-4">
      <div className="flex w-full items-center justify-between gap-2">
        <motion.div
          className="h-6 w-32 bg-gray-200 rounded"
          animate={{
            backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="h-6 w-24 bg-gray-200 rounded"
          animate={{
            backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-4 w-full bg-gray-200 rounded"
            animate={{
              backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    </CardFooter>
  </Card>
);

export default function GalleryInventaris({ inventarisData, isLoading = false }: GalleryInventarisProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {inventarisData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Image
                src={item.fotoUrl || "/profil.jpg"}
                alt={item.namaBarang}
                fill
                className="object-cover"
                priority
              />
            </div>
            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <div className="flex w-full items-center justify-between gap-2">
                <h3 className="font-semibold">{item.namaBarang}</h3>
                <Badge variant="outline">{item.kategori}</Badge>
              </div>
              <div className="flex w-full flex-col gap-1 text-sm text-muted-foreground">
                <p>Jumlah: {item.jumlah} {item.satuan}</p>
                <p>Lokasi: {item.lokasi}</p>
                <p>Kondisi: {item.kondisi}</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}