"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash, Upload, Edit } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { KontenData, updateKontenWithOptionalFoto, StatusKonten } from "@/lib/services/supabase/konten";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFields } from "./form-fields";
import { formSchema, FormValues } from "./edit-schema";
import Swal from "sweetalert2";
import { ImageUpload } from "./image-upload";   

interface KontenDataWithTags extends KontenData {
  tags?: { id: number; nama: string }[];
}

interface ContentEditProps {
  content: KontenDataWithTags;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ContentEdit({ content, onCancel, onSuccess }: ContentEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(content.fotoUrl || null);
  const [previewImage, setPreviewImage] = useState<string | null>(content.fotoUrl || null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: content.judul,
      deskripsi: content.deskripsi,
      kategoriId: content.kategoriId,
      penting: Boolean(content.penting),
      tanggal: new Date(content.tanggal),
      waktu: content.waktu || undefined,
      lokasi: content.lokasi || undefined,
      penulis: content.penulis,
      tampilkanDiBeranda: Boolean(content.tampilkanDiBeranda),
      tags: content.tags?.map(tag => tag.id) || [],  
      donaturId: content.donaturId || undefined,
      kotakAmalId: content.kotakAmalId || undefined,
      fotoUrl: content.fotoUrl || undefined,
      slug: content.slug || "",
      viewCount: content.viewCount || 0,
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedImage(fileUrl);
      setPreviewImage(fileUrl);
      setIsImageDeleted(false);
      form.setValue("fotoUrl", fileUrl);
    }
  };
  
  const handleDeleteImage = () => {
    Swal.fire({
      title: 'Hapus Foto?',
      text: 'Anda yakin ingin menghapus foto ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedImage(null);
        setPreviewImage(null);
        setIsImageDeleted(true);
        form.setValue("fotoUrl", "");
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Foto berhasil dihapus',
          showConfirmButton: false,
          timer: 1500,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }
    });
  };
  
  const handleEditImage = () => {
    document.getElementById('foto-upload')?.click();
  };
  

  useEffect(() => {
    const animateCssLink = document.createElement('link');
    animateCssLink.rel = 'stylesheet';
    animateCssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(animateCssLink);
    
    return () => {
      document.head.removeChild(animateCssLink);
    };
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      Swal.fire({
        title: 'Menyimpan...',
        html: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });
      
      const updatedContent: Partial<Omit<KontenData, "fotoUrl" | "id" | "createdAt" | "updatedAt">> = {
        judul: values.judul,
        deskripsi: values.deskripsi,
        kategoriId: parseInt(values.kategoriId.toString()),
        penting: values.penting,
        tanggal: format(values.tanggal, "yyyy-MM-dd"),
        waktu: values.waktu || undefined,
        lokasi: values.lokasi || undefined,
        penulis: values.penulis,
        tampilkanDiBeranda: values.tampilkanDiBeranda,
        status: values.status as unknown as StatusKonten,  
        donaturId: values.donaturId || undefined,
        kotakAmalId: values.kotakAmalId || undefined,
        slug: values.slug,
        viewCount: values.viewCount,
      };
      
      let fileForUpload: File | undefined;
      
      if (selectedImage && selectedImage !== content.fotoUrl) {
        try {
          fileForUpload = new File([await fetch(selectedImage).then(r => r.blob())], "foto.jpg");
        } catch (error) {
          console.error("Error saat memproses gambar:", error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memproses Gambar',
            text: 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.',
            confirmButtonText: 'Tutup'
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      if (isImageDeleted) {
        fileForUpload = undefined; 
      }
    
      try {
        await updateKontenWithOptionalFoto(
          content.id, 
          updatedContent,
          fileForUpload
        );
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Berhasil!',
          text: 'Konten berhasil diperbarui',
          showConfirmButton: false,
          timer: 1500,
          showClass: {
            popup: 'animate__animated animate__zoomIn'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut'
          },
          didClose: () => {
            onSuccess();
          }
        });
      } catch (error) {
        console.error("Error saat update konten:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: 'Terjadi kesalahan saat menyimpan perubahan. Silakan coba lagi.',
          confirmButtonText: 'Tutup',
          showClass: {
            popup: 'animate__animated animate__shakeX'
          }
        });
      }
    } catch (err) {
      console.error("Error saat update konten:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: 'Terjadi kesalahan saat menyimpan perubahan. Silakan coba lagi.',
        confirmButtonText: 'Tutup',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const availableTags = content.tags || [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden p-6 mb-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Edit Konten</h1>
        </div>
      </div>
      
      <Separator className="mb-6" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormFields 
            form={form} 
            isSubmitting={isSubmitting} 
            tags={availableTags}
            previewImage={previewImage}
            onImageChange={handleImageChange}
            onDeleteImage={handleDeleteImage}
          />
          
          <Separator />
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}