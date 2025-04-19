import { z } from "zod";

export const schema = z.object({
  id: z.number(),
  no: z.number(),
  nama: z.string(),
  alamat: z.string(),
  jan: z.number(),
  feb: z.number(),
  mar: z.number(),
  apr: z.number(),
  mei: z.number(),
  jun: z.number(),
  jul: z.number(),
  aug: z.number(),
  sep: z.number(),
  okt: z.number(),
  nov: z.number(),
  des: z.number(),
  infaq: z.number(),
});

export const donasiKhususSchema = z.object({
  id: z.number(),
  no: z.number(),
  nama: z.string(),
  tanggal: z.string(),
  jumlah: z.number(),
  keterangan: z.string(),
});

export const kotakAmalSchema = z.object({
  id: z.number(),
  no: z.number(),
  nama: z.string(),
  lokasi: z.string(),
  jan: z.number(),
  feb: z.number(),
  mar: z.number(),
  apr: z.number(),
  mei: z.number(),
  jun: z.number(),
  jul: z.number(),
  aug: z.number(),
  sep: z.number(),
  okt: z.number(),
  nov: z.number(),
  des: z.number(),
});

export type DonaturData = z.infer<typeof schema>;
export type KotakAmalData = z.infer<typeof kotakAmalSchema>;
export type DonasiKhususData = z.infer<typeof donasiKhususSchema>;
