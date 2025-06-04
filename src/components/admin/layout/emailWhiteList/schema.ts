// src/components/admin/layout/emailWhitelist/schema.ts
import { z } from "zod";

export enum Jabatan {
  DEVELOPER = "DEVELOPER",
  MAINTENANCE = "MAINTENANCE",
  PENASEHAT = "PENASEHAT",
  KETUA = "KETUA",
  SEKRETARIS = "SEKRETARIS",
  BENDAHARA = "BENDAHARA",
  KOORDINATOR = "KOORDINATOR",
  PENGURUS = "PENGURUS",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  CONTENT = "CONTENT",
  VIEWER = "VIEWER",
  MANAGEMENT = "MANAGEMENT",
  INVENTORY = "INVENTORY",
}

export const ProfileDataSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  email: z.string().email(),
});

export type ProfileData = z.infer<typeof ProfileDataSchema>;

export const EmailWhitelistSchema = z.object({
  id: z.string().uuid(),
  nama: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  isActive: z.boolean(),
  jabatan: z.nativeEnum(Jabatan),
  role: z.nativeEnum(Role),
  addedBy: z.string().uuid().nullable().optional(),
  addedByUser: ProfileDataSchema.nullable().optional(),
  addedAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type EmailWhitelistData = z.infer<typeof EmailWhitelistSchema>;

// Schema untuk membuat email whitelist baru
export const CreateEmailWhitelistSchema = EmailWhitelistSchema.omit({
  id: true,
  addedAt: true,
  updatedAt: true,
  addedByUser: true,
}).extend({
  addedBy: z.string().uuid().optional(),
});

export type CreateEmailWhitelistPayload = z.infer<
  typeof CreateEmailWhitelistSchema
>;

// Schema untuk update email whitelist
export const UpdateEmailWhitelistSchema = EmailWhitelistSchema.omit({
  id: true,
  addedAt: true,
  updatedAt: true,
  addedByUser: true,
}).partial();

export type UpdateEmailWhitelistPayload = z.infer<
  typeof UpdateEmailWhitelistSchema
>;

// Schema untuk validasi form
export const EmailWhitelistFormSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  isActive: z.boolean().default(true),
  jabatan: z.nativeEnum(Jabatan, {
    errorMap: () => ({ message: "Pilih jabatan yang valid" }),
  }),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Pilih role yang valid" }),
  }),
});

export type EmailWhitelistFormData = z.infer<typeof EmailWhitelistFormSchema>;
