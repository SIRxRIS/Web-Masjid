"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, User, Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KontenData, getKontenData, deleteKonten } from "@/lib/services/supabase/konten";
import { safeFormatDate } from "../date-helper";

const getBadgeVariant = (kategoriId: number) => {
  const variants: Record<number, string> = {
    1: "bg-primary text-primary-foreground", 
    2: "bg-purple-500 text-purple-50", 
    3: "bg-green-500 text-green-50",
    4: "bg-yellow-500 text-yellow-50", 
    5: "bg-pink-500 text-pink-50", 
    6: "bg-indigo-500 text-indigo-50", 
    7: "bg-teal-500 text-teal-50", 
    8: "bg-orange-500 text-orange-50", 
    9: "bg-red-500 text-red-50", 
  };
  
  return variants[kategoriId] || "bg-gray-500 text-gray-50";
};

const getKategoriLabel = (kategoriId: number) => {
  const labels: Record<number, string> = {
    1: "Kegiatan Masjid",
    2: "Pengumuman",
    3: "Kajian Rutin",
    4: "Kegiatan TPQ/TPA",
    5: "Lomba dan Acara",
    6: "Program Ramadhan",
    7: "Idul Fitri",
    8: "Idul Adha",
    9: "Bakti Sosial",
  };
  
  return labels[kategoriId] || "Lainnya";
};

interface ContentGalleryProps {
  onViewDetail: (content: KontenData) => void;
  onEditContent: (content: KontenData) => void;
  searchQuery?: string;
  kategoriFilter?: string;
  sortBy?: string;
}

export function ContentGallery({ 
  onViewDetail, 
  onEditContent, 
  searchQuery = "", 
  kategoriFilter = "all", 
  sortBy = "newest" 
}: ContentGalleryProps) {
  const [contents, setContents] = useState<KontenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKonten = async () => {
      try {
        setIsLoading(true);
        const data = await getKontenData();
        setContents(data);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data konten. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    loadKonten();
  }, []);
  
  const handleDeleteContent = async (id: string) => {
    try {
      await deleteKonten(Number(id));
      setContents(contents.filter(content => content.id.toString() !== id));
    } catch (err) {
      setError("Gagal menghapus konten. Silakan coba lagi nanti.");
    }
  };
  
  const filteredContents = contents
    .filter(content => {
      if (searchQuery && !content.judul.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !content.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (kategoriFilter !== "all" && content.kategoriId.toString() !== kategoriFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
        case "name_asc":
          return a.judul.localeCompare(b.judul);
        case "name_desc":
          return b.judul.localeCompare(a.judul);
        case "newest":
        default:
          return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
      }
    });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="overflow-hidden h-full">
            <div className="h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full" />
              <div className="flex flex-col gap-2 mt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Terjadi Kesalahan</h3>
        <p className="mt-2 text-muted-foreground max-w-md">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-6"
          variant="outline"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {filteredContents.map((content, index) => (
        <motion.div
          key={content.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden h-full border hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden group w-full">
              <img 
                src={content.fotoUrl || "/api/placeholder/600/400"} 
                alt={content.judul}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {content.penting && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive" className="px-3 py-1 font-medium">
                    Penting
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <Badge className={`${getBadgeVariant(content.kategoriId)} px-3 py-1 font-medium`}>
                  {getKategoriLabel(content.kategoriId)}
                </Badge>
              </div>
            </div>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-xl line-clamp-2">{content.judul}</CardTitle>
              <CardDescription className="flex flex-col gap-1 mt-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{safeFormatDate(content.tanggal, "dd MMMM yyyy")}</span>
                </div>
                {content.waktu && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{content.waktu}</span>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  <span>{content.penulis}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2 flex-grow">
              <p className="text-muted-foreground line-clamp-3">
                {content.deskripsi}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 px-4 py-2 mt-auto border-t border-border">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onViewDetail(content)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEditContent(content)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Konten</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus konten ini? 
                      Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => handleDeleteContent(content.id.toString())}
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
      
      {filteredContents.length === 0 && (
        <motion.div 
          className="col-span-full flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="rounded-full bg-muted p-6">
            <Tag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-xl font-medium">Tidak ada konten</h3>
          <p className="mt-2 text-muted-foreground max-w-md">
            {searchQuery || kategoriFilter !== "all" ? 
              "Tidak ada konten yang sesuai dengan filter yang dipilih." : 
              "Belum ada konten yang ditambahkan. Silakan tambahkan konten baru dengan mengklik tombol \"Tambah Konten\"."
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}