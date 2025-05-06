"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Plus, AlertTriangle } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ContentFormValues, tagKontenContoh } from "../../content-schema";

interface AdvancedTabProps {
  form: UseFormReturn<ContentFormValues>;
  isSubmitting: boolean;
}

export function AdvancedTab({ form, isSubmitting }: AdvancedTabProps) {
  const [inputTag, setInputTag] = useState<string>("");
  
  const addTag = () => {
    const cleanTag = inputTag.trim();
    
    if (cleanTag && !form.getValues().tags.includes(cleanTag)) {
      const currentTags = form.getValues().tags;
      form.setValue("tags", [...currentTags, cleanTag]);
      setInputTag("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues().tags;
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  
  const selectExistingTag = (tagName: string) => {
    const currentTags = form.getValues().tags;
    if (!currentTags.includes(tagName)) {
      form.setValue("tags", [...currentTags, tagName]);
    }
  };

  return (
    <TabsContent value="lanjutan" className="space-y-6">
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status Publikasi</CardTitle>
          <CardDescription>
            Atur visibilitas dan status publikasi konten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Konten</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-1/3 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Pilih status konten" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Draft</Badge>
                        <span>Konten disimpan sebagai draft</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PUBLISHED">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Dipublikasikan</Badge>
                        <span>Konten dipublikasikan</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="REVIEWED">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Dilihat</Badge>
                        <span>Konten telah dilihat</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ARCHIVED">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Diarsipkan</Badge>
                        <span>Konten diarsipkan</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Draft: hanya admin yang dapat melihat. Dipublikasikan: terlihat oleh semua pengunjung. Dilihat: telah dilihat oleh pengunjung website. Diarsipkan: tidak ditampilkan di website.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tag Konten</CardTitle>
          <CardDescription>
            Tambahkan tag untuk memudahkan pengunjung menemukan konten terkait
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {form.watch("tags").length > 0 ? (
              form.watch("tags").map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                    onClick={() => removeTag(tag)}
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Belum ada tag yang ditambahkan</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Masukkan tag baru"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="border-gray-300 dark:border-gray-700"
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              disabled={!inputTag.trim() || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tag populer:</h4>
            <div className="flex flex-wrap gap-2">
              {tagKontenContoh.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => selectExistingTag(tag.nama)}
                >
                  {tag.nama}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Integrasi dengan Donatur dan KotakAmal */}
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Integrasi Data</CardTitle>
          <CardDescription>
            Hubungkan konten dengan data donatur atau kotak amal (opsional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Fitur ini masih dalam pengembangan. Silakan hubungi administrator sistem untuk menggunakan fitur ini.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <FormField
              control={form.control}
              name="donaturId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donatur Terkait</FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)} 
                    value={field.value?.toString() || ""}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Pilih donatur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Donatur #1</SelectItem>
                      <SelectItem value="2">Donatur #2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Hubungkan konten dengan data donatur
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="kotakAmalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kotak Amal Terkait</FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)} 
                    value={field.value?.toString() || ""}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Pilih kotak amal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Kotak Amal #1</SelectItem>
                      <SelectItem value="2">Kotak Amal #2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Hubungkan konten dengan data kotak amal
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

