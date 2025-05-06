"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { Save, Loader2 } from "lucide-react"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormPengurusSchema, type FormPengurusType } from "./pengurus-schema"
import { FormDataTab, FormFotoTab } from "./form-tabs"
import { createPengurusWithFoto } from "@/lib/services/supabase/pengurus"

export function FormPengurus() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("form")

  const form = useForm<FormPengurusType>({
    resolver: zodResolver(FormPengurusSchema),
    defaultValues: { nama: "", no: 0, jabatan: "", periode: "" },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", { description: "Maksimal 5MB." })
      return
    }
    
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result as string)
    reader.readAsDataURL(file)
    toast.success("Foto berhasil diunggah", { description: `${file.name}` })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    } else {
      toast.error("Format file tidak valid", { description: "Hanya file gambar yang diperbolehkan." })
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setSelectedFile(null)
    toast.info("Foto telah dihapus")
  }

  const onSubmit = async (data: z.infer<typeof FormPengurusSchema>) => {
    setIsSubmitting(true)
    try {
      if (!selectedFile) {
        await createPengurusWithFoto(data, null)
      } else {
        await createPengurusWithFoto(data, selectedFile)
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pengurus berhasil disimpan.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: { 
          popup: 'animate__animated animate__fadeInUp',
          title: 'text-primary text-xl',
          htmlContainer: 'text-base'
        },
      })
      form.reset()
      setPreviewImage(null)
      setSelectedFile(null)
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan!',
        text: 'Terjadi kesalahan. Silakan coba lagi.',
        confirmButtonText: 'Tutup',
        customClass: {
          confirmButton: 'bg-primary text-white rounded-md px-4 py-2'
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-4xl shadow-lg overflow-hidden p-0 mx-auto">
        <CardHeader className="border-b m-0 rounded-none flex flex-col items-center pt-3 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl text-center mt-1 font-bold">Form Data Pengurus</CardTitle>
          <CardDescription className="text-muted-foreground text-center text-sm sm:text-base">
            Silakan isi data lengkap pengurus masjid
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-4 sm:p-6">
              <Tabs 
                defaultValue="form" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Mobile View */}
                  <div className="w-full sm:hidden">
                    <Select 
                      defaultValue="form"
                      onValueChange={setActiveTab}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="form">Formulir Data</SelectItem>
                        <SelectItem value="foto">Upload Foto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desktop View */}
                  <TabsList className="hidden sm:flex w-full sm:w-auto">
                    <TabsTrigger
                      value="form"
                      title="Form data lengkap pengurus masjid"
                      className="text-sm sm:text-base px-4 py-2"
                    >
                      Formulir Data
                    </TabsTrigger>
                    <TabsTrigger
                      value="foto"
                      title="Upload foto pengurus"
                      className="text-sm sm:text-base px-4 py-2"
                    >
                      Upload Foto
                    </TabsTrigger>
                  </TabsList>
                </div>

                <FormDataTab form={form} isSubmitting={isSubmitting} />
                
                <FormFotoTab
                  selectedFile={selectedFile}
                  previewImage={previewImage}
                  isSubmitting={isSubmitting}
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  handleFileChange={handleFileChange}
                  removeImage={removeImage}
                />
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-end border-t p-4 sm:p-6">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto min-w-[120px] h-10 text-sm sm:text-base text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Simpan Data
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}