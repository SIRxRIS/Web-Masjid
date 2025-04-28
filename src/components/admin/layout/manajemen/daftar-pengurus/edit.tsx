"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PengurusData, updatePengurusWithOptionalFoto } from "@/lib/services/pengurus";
import { jabatanToNoMap } from "../tambah-pengurus//pengurus-schema";
import { ErrorMessage, FieldDescription } from "../tambah-pengurus/form-components";

const EditSchema = z.object({
  id: z.number(),
  nama: z.string().min(1, "Nama wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  periode: z.string().min(1, "Periode wajib diisi"),
  no: z.number(),
  fotoUrl: z.string().optional(),
});

type EditFormData = z.infer<typeof EditSchema>;

interface EditPengurusProps {
  isOpen: boolean;
  onClose: () => void;
  data: PengurusData | null;
  onSave: (data: PengurusData) => void;
}

export function EditPengurus({ isOpen, onClose, data, onSave }: EditPengurusProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const form = useForm<EditFormData>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      id: data?.id || 0,
      nama: data?.nama || "",
      jabatan: data?.jabatan || "",
      periode: data?.periode || "",
      no: data?.no || 0,
      fotoUrl: data?.fotoUrl || "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        nama: data.nama,
        jabatan: data.jabatan,
        periode: data.periode,
        no: data.no,
        fotoUrl: data.fotoUrl,
      });
      setPreviewImage(data.fotoUrl);
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", { description: "Maksimal 5MB." });
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    toast.success("Foto berhasil diunggah", { description: `${file.name}` });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      toast.error("Format file tidak valid", { description: "Hanya file gambar yang diperbolehkan." });
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    form.setValue("fotoUrl", "");
    toast.info("Foto telah dihapus");
  };

  const onSubmit = async (formData: EditFormData) => {
    if (!data) return;
    
    setIsSubmitting(true);
    try {
      const updatedData = await updatePengurusWithOptionalFoto(formData.id, formData, selectedFile || undefined);
      onSave(updatedData);
      toast.success("Berhasil", { description: "Data pengurus berhasil diperbarui" });
      onClose();
    } catch (error) {
      console.error("Error updating pengurus:", error);
      toast.error("Error", { description: "Gagal memperbarui data pengurus" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">Edit Data Pengurus</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs 
              defaultValue="form" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full mt-4"
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

              {/* Data Form Tab */}
              <TabsContent value="form" className="mt-4 sm:mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          Nama Lengkap <Badge variant="destructive" className="h-5">Wajib</Badge>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan nama lengkap pengurus" 
                            {...field} 
                            className="h-10 text-base bg-muted/50 focus:bg-background transition-colors" 
                          />
                        </FormControl>
                        <ErrorMessage>
                          {form.formState.errors.nama?.message}
                        </ErrorMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jabatan"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          Jabatan <Badge variant="destructive" className="h-5">Wajib</Badge>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("no", jabatanToNoMap[value] || 0);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="h-10 text-base bg-muted/50 focus:bg-background transition-colors">
                              <SelectValue placeholder="Pilih jabatan" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="max-h-72 overflow-y-auto">
                                {Object.entries(jabatanToNoMap).map(([jabatan, no]) => (
                                  <SelectItem key={no} value={jabatan} className="text-base">
                                    {jabatan}
                                  </SelectItem>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <ErrorMessage>
                          {form.formState.errors.jabatan?.message}
                        </ErrorMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="periode"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          Periode <Badge variant="destructive" className="h-5">Wajib</Badge>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Contoh: 2023-2027" 
                            {...field} 
                            className="h-10 text-base bg-muted/50 focus:bg-background transition-colors" 
                          />
                        </FormControl>
                        <ErrorMessage>
                          {form.formState.errors.periode?.message}
                        </ErrorMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="no"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          Nomor Urut <Badge variant="secondary" className="h-5">Auto</Badge>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            readOnly 
                            {...field} 
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-10 text-base bg-muted cursor-not-allowed" 
                          />
                        </FormControl>
                        <FieldDescription className="text-xs text-muted-foreground mt-1">
                          Terisi otomatis sesuai jabatan yang dipilih
                        </FieldDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Foto Tab */}
              <TabsContent value="foto" className="mt-4 sm:mt-6">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">Foto</h3>
                    <Badge variant="secondary" className="h-5">Opsional</Badge>
                  </div>
                  
                  <div 
                    className={`relative w-full sm:w-64 h-64 rounded-xl flex items-center justify-center transition-all overflow-hidden cursor-pointer
                      ${isDragging 
                        ? 'bg-muted border-primary border-2' 
                        : 'bg-muted/50 hover:bg-muted border border-dashed border-border'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('foto-edit')?.click()}
                  >
                    {previewImage ? (
                      <>
                        <Image 
                          src={previewImage} 
                          alt="Preview" 
                          fill 
                          className="object-cover rounded-xl" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage();
                                  }}
                                  className="rounded-full">
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hapus foto</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </>
                    ) : isSubmitting ? (
                      <div className="w-full h-full rounded-xl bg-muted animate-pulse" />
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                        <p className="font-medium text-lg">
                          Tarik & Lepas Foto
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          atau klik untuk memilih file
                        </p>
                      </div>
                    )}
                  </div>

                  <Input 
                    id="foto-edit"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />

                  <div className="text-center w-full sm:w-auto">
                    {selectedFile ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                        <Badge variant="outline" className="w-full sm:w-auto px-3 py-1 break-all">
                          {selectedFile.name}
                        </Badge>
                        <span className="text-muted-foreground">
                          ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        <p className="mb-1">Format yang didukung: JPG, PNG, WEBP</p>
                        <p>Ukuran maksimal: 5MB</p>
                        <p className="mt-1 text-xs italic">*Anda dapat melewati bagian ini jika tidak ingin mengganti foto</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px] text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Simpan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}