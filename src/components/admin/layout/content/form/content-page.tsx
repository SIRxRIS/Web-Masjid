"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/content/site-header";
import { ContentForm } from "./content-form/content-form";
import { ContentGallery } from "./content-gallery";
import { ContentDetail } from "./content-detail";
import { ContentEdit } from "./content-edit/content-edit";
import { Search, PlusCircle, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KontenData } from "@/lib/services/supabase/konten";

export default function ContentPage() {
  const [view, setView] = useState<"gallery" | "form" | "detail" | "edit">("gallery");
  const [selectedContent, setSelectedContent] = useState<KontenData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const handleViewDetail = (content: KontenData) => {
    setSelectedContent(content);
    setView("detail");
  };
  
  const handleEditContent = (content: KontenData) => {
    setSelectedContent(content);
    setView("edit"); 
  };
  
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <AnimatePresence mode="wait">
          {view === "form" && (
            <motion.div
              key="form-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto pt-4"
            >
              <ContentForm 
                onCancel={() => setView("gallery")}
                onSuccess={() => {
                  setView("gallery");
                }}
              />
            </motion.div>
          )}
          
          {view === "detail" && selectedContent && (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto pt-4"
            >
              <ContentDetail 
                content={selectedContent}
                onBack={() => {
                  setView("gallery");
                  setSelectedContent(null);
                }}
              />
            </motion.div>
          )}
          
          {view === "edit" && selectedContent && (
            <motion.div
              key="edit-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto pt-4"
            >
              <ContentEdit
                content={selectedContent}
                onCancel={() => {
                  setView("gallery");
                  setSelectedContent(null);
                }}
                onSuccess={() => {
                  setView("gallery");
                  setSelectedContent(null);
                }}
              />
            </motion.div>
          )}
          
          {view === "gallery" && (
            <motion.div
              key="gallery-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  Pengelolaan Konten Masjid
                </motion.h1>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Button 
                    onClick={() => setView("form")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tambah Konten
                  </Button>
                </motion.div>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input 
                      placeholder="Cari konten..." 
                      className="pl-10 border-gray-300 dark:border-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
                      <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Kategori" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="1">Kegiatan Masjid</SelectItem>
                        <SelectItem value="2">Pengumuman</SelectItem>
                        <SelectItem value="3">Kajian Rutin</SelectItem>
                        <SelectItem value="4">Kegiatan TPQ/TPA</SelectItem>
                        <SelectItem value="5">Lomba dan Acara</SelectItem>
                        <SelectItem value="6">Program Ramadhan</SelectItem>
                        <SelectItem value="7">Idul Fitri</SelectItem>
                        <SelectItem value="8">Idul Adha</SelectItem>
                        <SelectItem value="9">Bakti Sosial</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
                        <div className="flex items-center">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Urutkan" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="oldest">Terlama</SelectItem>
                        <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <ContentGallery 
                  onViewDetail={handleViewDetail}
                  onEditContent={handleEditContent}
                  searchQuery={searchQuery}
                  kategoriFilter={kategoriFilter}
                  sortBy={sortBy}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}