import { z } from "zod";

export enum StatusKonten {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export const kategoriKontenContoh = [
  { id: "1", label: "Kajian" },
  { id: "2", label: "Pengumuman" },
  { id: "3", label: "Kegiatan" },
  { id: "4", label: "Berita" },
  { id: "5", label: "Artikel" },
];

export const tagKontenContoh = [
  { id: 1, nama: "kajian" },
  { id: 2, nama: "pengumuman" },
  { id: 3, nama: "peringatan" },
  { id: 4, nama: "ramadhan" },
  { id: 5, nama: "infaq" },
  { id: 6, nama: "zakat" },
  { id: 7, nama: "qurban" },
  { id: 8, nama: "jumat" },
];

export const ContentFormSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(100, "Judul maksimal 100 karakter"),
  kategoriId: z.string().min(1, "Kategori wajib dipilih"),
  tanggal: z.date({
    required_error: "Tanggal wajib diisi",
  }),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  penulis: z.string().min(3, "Nama penulis minimal 3 karakter"),
  waktu: z.string().optional(),
  lokasi: z.string().optional(),
  donaturId: z.number().optional(),
  kotakAmalId: z.number().optional(),
  tampilkanDiBeranda: z.boolean(),
  penting: z.boolean(),
  status: z.nativeEnum(StatusKonten, {
    required_error: "Status wajib diisi",
  }),
  tags: z.array(z.string()),
});

export type ContentFormValues = z.infer<typeof ContentFormSchema>;

export const defaultValues: ContentFormValues = {
  judul: "",
  kategoriId: "",
  tanggal: new Date(),
  deskripsi: "",
  penulis: "",
  waktu: "",
  lokasi: "",
  donaturId: undefined,
  kotakAmalId: undefined,
  tampilkanDiBeranda: false,
  penting: false,
  status: StatusKonten.DRAFT,
  tags: [],
};

export interface GambarKontenType {
  filename: string;
  file: File;
  preview: string;
  urutan: number;
  isUtama: boolean;
  caption: string;
}
