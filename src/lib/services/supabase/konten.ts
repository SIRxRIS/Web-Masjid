// src/lib/services/supabase/konten.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type GambarKontenData = {
  id: number;
  kontenId: number;
  url: string;
  filename: string;
  caption: string;
  urutan: number;
  isUtama: boolean;
  createdAt: string;
  updatedAt: string;
};

export type KontenData = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  tanggal: string;
  waktu?: string;
  lokasi?: string;
  penulis: string;
  kategoriId: number;
  donaturId?: number;
  kotakAmalId?: number;
  penting: boolean;
  tampilkanDiBeranda: boolean;
  status: StatusKonten;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  fotoUrl?: string;
};

export type TagKontenData = {
  id: number;
  nama: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export enum StatusKonten {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  REVIEWED = "REVIEWED",
}

function generateFileName(prefix = "konten") {
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}/${Date.now()}-${random}`;
}

async function uploadGambarKonten(file: File): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const fileExt = file.name.split(".").pop();
  const filePath = generateFileName("konten") + `.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", JSON.stringify(uploadError, null, 2));
    throw new Error("Failed to upload image");
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl ?? "";
}

async function deleteOldGambar(gambarUrl: string) {
  if (!gambarUrl) return;

  const supabase = await createServerSupabaseClient();
  const path = gambarUrl.split("/images/")[1];
  if (!path) return;

  const { error } = await supabase.storage.from("images").remove([path]);

  if (error) {
    console.error("Error deleting old image:", JSON.stringify(error, null, 2));
  }
}

export async function createKontenWithFoto(
  data: Omit<KontenData, "id" | "createdAt" | "updatedAt">,
  file: File | null
) {
  try {
    const supabase = await createServerSupabaseClient();
    let fotoUrl = "/images/profile.jpg";

    if (file) {
      fotoUrl = await uploadGambarKonten(file);
    }

    const now = new Date().toISOString();

    const { data: inserted, error } = await supabase
      .from("konten")
      .insert([
        {
          ...data,
          fotoUrl,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating konten:", JSON.stringify(error, null, 2));
      throw new Error(
        "Failed to create konten: " + (error.message || "Unknown Error")
      );
    }

    if (!inserted || inserted.length === 0) {
      throw new Error("Failed to create konten: No data returned");
    }

    return inserted[0];
  } catch (error) {
    console.error("Error in createKontenWithFoto:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while creating konten");
  }
}

export async function updateKontenWithOptionalFoto(
  id: number,
  updates: Partial<
    Omit<KontenData, "id" | "createdAt" | "updatedAt" | "fotoUrl">
  >,
  file?: File
) {
  const supabase = await createServerSupabaseClient();
  let fotoUrl: string | undefined;

  if (file) {
    const { data: oldData, error: oldDataError } = await supabase
      .from("konten")
      .select("fotoUrl")
      .eq("id", id)
      .single();

    if (oldDataError) {
      console.error("Error fetching old konten data:", oldDataError);
      throw new Error("Failed to fetch old konten data");
    }
    if (oldData?.fotoUrl) {
      await deleteOldGambar(oldData.fotoUrl);
    }
    fotoUrl = await uploadGambarKonten(file);
  }

  const { data, error } = await supabase
    .from("konten")
    .update({
      ...updates,
      ...(fotoUrl ? { fotoUrl } : {}),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating konten:", error);
    throw new Error("Failed to update konten");
  }

  return data?.[0];
}

export async function getKontenData(): Promise<KontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Error fetching konten data:", error);
    throw new Error("Failed to fetch konten data");
  }

  return data || [];
}

export async function getKontenById(id: number): Promise<KontenData> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching konten by id:", error);
    throw new Error("Failed to fetch konten");
  }

  return data;
}

export async function getKontenBySlug(slug: string): Promise<KontenData> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching konten by slug:", error);
    throw new Error("Failed to fetch konten");
  }

  return data;
}

export async function deleteKonten(id: number) {
  const supabase = await createServerSupabaseClient();

  // Ambil data foto utama dan gambar konten untuk dihapus dari storage
  const { data: kontenData, error: kontenError } = await supabase
    .from("konten")
    .select("fotoUrl")
    .eq("id", id)
    .single();

  if (kontenData?.fotoUrl) {
    await deleteOldGambar(kontenData.fotoUrl);
  }

  // Hapus gambar konten terkait
  const { data: gambarData, error: gambarError } = await supabase
    .from("gambar_konten")
    .select("url")
    .eq("kontenId", id);

  if (gambarData) {
    for (const gambar of gambarData) {
      await deleteOldGambar(gambar.url);
    }
  }

  const { error } = await supabase.from("konten").delete().eq("id", id);

  if (error) {
    console.error("Error deleting konten:", JSON.stringify(error, null, 2));
    throw new Error("Failed to delete konten");
  }

  return { message: "Konten deleted successfully" };
}

export async function uploadMultipleFotosKonten(
  kontenId: number,
  files: File[]
) {
  const supabase = await createServerSupabaseClient();
  const uploadedImages = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const filePath = generateFileName("konten") + `.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", JSON.stringify(uploadError, null, 2));
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      uploadedImages.push({
        kontenId,
        url: publicUrlData.publicUrl,
        filename: file.name,
        caption: "",
        urutan: uploadedImages.length,
        isUtama: uploadedImages.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  if (uploadedImages.length > 0) {
    const { data: inserted, error: insertError } = await supabase
      .from("gambar_konten")
      .insert(uploadedImages)
      .select();

    if (insertError) {
      console.error(
        "Error inserting uploaded images:",
        JSON.stringify(insertError, null, 2)
      );
      throw new Error("Failed to save images to database");
    }

    return inserted;
  }

  return [];
}

export async function updateGambarKonten(
  id: number,
  updates: Partial<Omit<GambarKontenData, "id" | "createdAt" | "updatedAt">>
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gambar_konten")
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating gambar konten:", error);
    throw new Error("Failed to update gambar konten");
  }

  return data?.[0];
}

export async function deleteGambarKonten(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data: gambarData, error: fetchError } = await supabase
    .from("gambar_konten")
    .select("url")
    .eq("id", id)
    .single();

  if (gambarData?.url) {
    await deleteOldGambar(gambarData.url);
  }

  const { error } = await supabase.from("gambar_konten").delete().eq("id", id);

  if (error) {
    console.error("Error deleting gambar konten:", error);
    throw new Error("Failed to delete gambar konten");
  }

  return { message: "Gambar konten deleted successfully" };
}

export async function getGambarKontenByKontenId(
  kontenId: number
): Promise<GambarKontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gambar_konten")
    .select("*")
    .eq("kontenId", kontenId)
    .order("urutan", { ascending: true });

  if (error) {
    console.error("Error fetching gambar konten:", error);
    throw new Error("Failed to fetch gambar konten");
  }

  return data || [];
}

export async function createTagKonten(
  tag: Omit<TagKontenData, "id" | "createdAt" | "updatedAt">
) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tag_konten")
    .insert([
      {
        ...tag,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating tag konten:", error);
    throw new Error("Failed to create tag konten");
  }

  return data?.[0];
}

export async function getTagKonten(): Promise<TagKontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tag_konten")
    .select("*")
    .order("nama", { ascending: true });

  if (error) {
    console.error("Error fetching tag konten:", error);
    throw new Error("Failed to fetch tag konten");
  }

  return data || [];
}

export async function updateTagKonten(
  id: number,
  updates: Partial<Omit<TagKontenData, "id" | "createdAt" | "updatedAt">>
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tag_konten")
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating tag konten:", error);
    throw new Error("Failed to update tag konten");
  }

  return data?.[0];
}

export async function deleteTagKonten(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("tag_konten").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tag konten:", error);
    throw new Error("Failed to delete tag konten");
  }

  return { message: "Tag konten deleted successfully" };
}

export async function addTagsToKonten(kontenId: number, tagIds: number[]) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const relations = tagIds.map((tagId) => ({
    kontenId,
    tagId,
    createdAt: now,
    updatedAt: now,
  }));

  const { data, error } = await supabase
    .from("konten_tag_konten")
    .insert(relations)
    .select();

  if (error) {
    console.error("Error adding tags to konten:", error);
    throw new Error("Failed to add tags to konten");
  }

  return data;
}

export async function removeTagFromKonten(kontenId: number, tagId: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("konten_tag_konten")
    .delete()
    .eq("kontenId", kontenId)
    .eq("tagId", tagId);

  if (error) {
    console.error("Error removing tag from konten:", error);
    throw new Error("Failed to remove tag from konten");
  }

  return { message: "Tag removed from konten successfully" };
}

export async function getTagsByKontenId(
  kontenId: number
): Promise<TagKontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten_tag_konten")
    .select("tagId")
    .eq("kontenId", kontenId);

  if (error) {
    console.error("Error fetching konten tags:", error);
    throw new Error("Failed to fetch konten tags");
  }

  if (!data || data.length === 0) {
    return [];
  }

  const tagIds = data.map((item) => item.tagId);

  const { data: tags, error: tagsError } = await supabase
    .from("tag_konten")
    .select("*")
    .in("id", tagIds);

  if (tagsError) {
    console.error("Error fetching tags by ids:", tagsError);
    throw new Error("Failed to fetch tags");
  }

  return tags || [];
}

// Fungsi tambahan untuk filter dan pencarian
export async function getKontenByKategori(
  kategoriId: number
): Promise<KontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten")
    .select("*")
    .eq("kategoriId", kategoriId)
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Error fetching konten by kategori:", error);
    throw new Error("Failed to fetch konten");
  }

  return data || [];
}

export async function searchKonten(query: string): Promise<KontenData[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("konten")
    .select("*")
    .or(`judul.ilike.%${query}%,deskripsi.ilike.%${query}%`)
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Error searching konten:", error);
    throw new Error("Failed to search konten");
  }

  return data || [];
}

export async function incrementViewCount(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc("increment_view_count", {
    konten_id: id,
  });

  if (error) {
    console.error("Error incrementing view count:", error);
    throw new Error("Failed to increment view count");
  }

  return { success: true };
}

export async function getTotalKontenPublished(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient();

    const { count, error } = await supabase
      .from("konten")
      .select("*", { count: "exact", head: true })
      .eq("status", "PUBLISHED");

    if (error) {
      console.error("Error mengambil jumlah konten published:", error);
      throw new Error("Gagal mengambil jumlah konten published");
    }

    return count || 0;
  } catch (error) {
    console.error("Error menghitung total konten published:", error);
    throw new Error("Gagal menghitung total konten published");
  }
}
