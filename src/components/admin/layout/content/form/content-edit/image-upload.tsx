"use client";

import { Trash, Upload, Edit } from "lucide-react";
import { FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useEffect } from "react";

interface ImageUploadProps {
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage?: () => void;
}

export function ImageUpload({ previewImage, onImageChange, onDeleteImage }: ImageUploadProps) {
  useEffect(() => {
    const animateCssLink = document.createElement('link');
    animateCssLink.rel = 'stylesheet';
    animateCssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(animateCssLink);
    
    return () => {
      if (document.head.contains(animateCssLink)) {
        document.head.removeChild(animateCssLink);
      }
    };
  }, []);

  const handleDelete = () => {
    if (onDeleteImage) {
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
          onDeleteImage();
          
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Foto berhasil dihapus',
            showConfirmButton: false,
            timer: 1500,
            showClass: {
              popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOut'
            }
          });
        }
      });
    }
  };
  
  const handleEditClick = () => {
    document.getElementById('foto-upload')?.click();
  };
  
  return (
    <FormItem>
      <FormLabel>Foto Konten</FormLabel>
      <div className="mt-2 space-y-4">
        {previewImage ? (
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-[200px] object-cover rounded-md border border-gray-200 dark:border-gray-700"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button 
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
                className="bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {onDeleteImage && (
                <Button 
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800 dark:text-red-500 dark:hover:bg-gray-700 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="foto-upload"
              className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG atau JPEG (Maks. 2MB)
                </p>
              </div>
            </label>
          </div>
        )}
        
        <input
          id="foto-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={onImageChange}
        />
      </div>
      <FormDescription>
        Opsional. Unggah foto untuk memperkaya konten masjid.
      </FormDescription>
    </FormItem>
  );
}