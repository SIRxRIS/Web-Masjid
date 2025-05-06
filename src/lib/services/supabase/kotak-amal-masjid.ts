import { supabase } from "@/lib/supabase";
import { KotakAmalMasjidData } from "@/components/admin/layout/finance/pemasukan/table-donation/schema";

export async function getKotakAmalMasjidData(tahunFilter?: number): Promise<KotakAmalMasjidData[]> {
  let query = supabase
    .from("KotakAmalMasjid")
    .select("*")
    .order("tanggal", { ascending: false });

  if (tahunFilter) {
    query = query.eq("tahun", tahunFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error mengambil data kotak amal masjid:", error);
    throw new Error("Gagal mengambil data kotak amal masjid");
  }

  return data || [];
}

export async function createKotakAmalMasjid(
  kotakAmalMasjid: Omit<KotakAmalMasjidData, "id" | "createdAt"> & {
    tahun: number;
  }
): Promise<KotakAmalMasjidData> {
  const now = new Date();
  
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .insert([{ 
      ...kotakAmalMasjid,
      createdAt: now.toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Error membuat kotak amal masjid:", error);
    throw new Error("Gagal membuat kotak amal masjid");
  }

  return data;
}

export async function getAvailableTahun(): Promise<number[]> {
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .select("tahun")
    .order("tahun", { ascending: false });

  if (error) {
    console.error("Error mengambil data tahun:", error);
    throw new Error("Gagal mengambil data tahun");
  }

  return [...new Set(data.map(item => item.tahun))];
}

export async function getKotakAmalById(id: number): Promise<KotakAmalMasjidData | null> {
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error mengambil data kotak amal:", error);
    throw new Error("Gagal mengambil data kotak amal");
  }

  return data;
}

export async function createKotakAmal(
  kotakAmal: Omit<KotakAmalMasjidData, "id" | "createdAt"> & {
    tahun: number;
  }
): Promise<KotakAmalMasjidData> {
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .insert([kotakAmal])
    .select()
    .single();

  if (error) {
    console.error("Error membuat data kotak amal:", error);
    throw new Error("Gagal membuat data kotak amal");
  }

  return data;
}

export async function updateKotakAmal(
  id: number,
  kotakAmal: Partial<Omit<KotakAmalMasjidData, "id" | "createdAt">>
): Promise<KotakAmalMasjidData> {
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .update(kotakAmal)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error mengupdate data kotak amal:", error);
    throw new Error("Gagal mengupdate data kotak amal");
  }

  return data;
}

export async function deleteKotakAmal(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("KotakAmalMasjid")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error menghapus data kotak amal:", error);
    throw new Error("Gagal menghapus data kotak amal");
  }
}

export async function getKotakAmalBulanan(tahun: number, bulan: number): Promise<number> {
  const start = `${tahun}-${bulan.toString().padStart(2, "0")}-01`;
  const end = new Date(tahun, bulan, 1).toISOString().split("T")[0]; 

  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .select("jumlah")
    .gte("tanggal", start)
    .lt("tanggal", end);

  if (error) {
    console.error("Error mengambil total kotak amal bulanan:", error);
    throw new Error("Gagal mengambil total kotak amal bulanan");
  }

  return data?.reduce((total, item) => total + item.jumlah, 0) || 0;
}

export async function getKotakAmalTahunan(tahun: number): Promise<number> {
  const { data, error } = await supabase
    .from("KotakAmalMasjid")
    .select("jumlah")
    .eq("tahun", tahun);

  if (error) {
    console.error("Error mengambil total kotak amal tahunan:", error);
    throw new Error("Gagal mengambil total kotak amal tahunan");
  }

  return data?.reduce((total, item) => total + item.jumlah, 0) || 0;
}