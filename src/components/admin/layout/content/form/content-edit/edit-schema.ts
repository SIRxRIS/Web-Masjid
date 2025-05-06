import * as z from "zod";

export enum StatusKonten {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export const formSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(100, "Judul maksimal 100 karakter"),
  kategoriId: z.number({
    required_error: "Kategori wajib dipilih",
    invalid_type_error: "Kategori harus berupa angka",
  }),
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
  status: z.nativeEnum(StatusKonten),  
  tags: z.array(z.number()),
  slug: z.string(),
  viewCount: z.number(),
  fotoUrl: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const kategoriOptions = [
  { id: 1, label: "Kegiatan Masjid", slug: "kegiatan-masjid" },
  { id: 2, label: "Pengumuman", slug: "pengumuman" },
  { id: 3, label: "Kajian Rutin", slug: "kajian-rutin" },
  { id: 4, label: "Kegiatan TPQ/TPA", slug: "kegiatan-tpq-tpa" },
  { id: 5, label: "Lomba dan Acara", slug: "lomba-dan-acara" },
  { id: 6, label: "Program Ramadhan", slug: "program-ramadhan" },
  { id: 7, label: "Idul Fitri", slug: "idul-fitri" },
  { id: 8, label: "Idul Adha", slug: "idul-adha" },
  { id: 9, label: "Bakti Sosial", slug: "bakti-sosial" }
];

export function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim(); 
}

export const gambarKontenFormSchema = z.object({
  caption: z.string().optional(),
  urutan: z.number().default(0),
  isUtama: z.boolean().default(false),
});

export type GambarKontenFormValues = z.infer<typeof gambarKontenFormSchema>;

export const tagKontenFormSchema = z.object({
  nama: z.string().min(2, "Nama tag minimal 2 karakter"),
  slug: z.string().optional(),
});

export type TagKontenFormValues = z.infer<typeof tagKontenFormSchema>;