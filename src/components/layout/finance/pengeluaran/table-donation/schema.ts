import { z } from "zod";

// Schema for donation data
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

export type DonaturData = z.infer<typeof schema>;
