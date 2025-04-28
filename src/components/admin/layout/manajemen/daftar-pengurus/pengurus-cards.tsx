"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { PengurusData, getPengurusData, deletePengurus } from "@/lib/services/pengurus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { EditPengurus } from "./edit";

export function PengurusCards() {
  const [pengurus, setPengurus] = useState<PengurusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState<PengurusData | null>(null);

  useEffect(() => {
    async function loadPengurusData() {
      try {
        const data = await getPengurusData();
        setPengurus(data);
      } catch (error) {
        toast.error("Error", { description: "Gagal memuat data pengurus" });
        console.error("Failed to load pengurus data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPengurusData();
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deletePengurus(deleteId);
      setPengurus(pengurus.filter(item => item.id !== deleteId));
      toast.success("Berhasil", { description: "Data pengurus berhasil dihapus" });
    } catch (error) {
      toast.error("Error", { description: "Gagal menghapus data pengurus" });
      console.error("Error deleting pengurus:", error);
    } finally {
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleEdit = (data: PengurusData) => {
    setEditData(data);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedData: PengurusData) => {
    setPengurus(pengurus.map(item => 
      item.id === updatedData.id ? updatedData : item
    ));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-[22px] p-6 bg-gray-200 dark:bg-gray-800">
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
            <div className="flex gap-2 justify-center">
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pengurus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h3 className="text-lg font-medium">Belum ada data pengurus</h3>
        <p className="text-sm text-gray-500">Silakan tambahkan data pengurus baru</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {pengurus.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <BackgroundGradient className="rounded-[22px]">
            <Card className="border-0 shadow-none bg-white dark:bg-zinc-900 rounded-[22px] h-full">
              <CardContent className="pt-6 px-4 sm:px-6 flex flex-col items-center">
                <div className="w-full aspect-[4/5] overflow-hidden rounded-xl">
                  <img
                    src={item.fotoUrl}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center mt-4">
                  <CardTitle className="text-lg font-semibold text-black dark:text-white">
                    {item.nama}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {item.jabatan}
                  </CardDescription>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {item.periode}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center gap-2 pb-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => confirmDelete(item.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          </BackgroundGradient>
        </motion.div>
      ))}

      {/* Alert Dialog Hapus */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pengurus ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Edit Pengurus */}
      <EditPengurus
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        data={editData}
        onSave={handleSaveEdit}
      />
    </div>
  );
}