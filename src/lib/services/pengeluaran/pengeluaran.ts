import { supabase } from "@/lib/supabase";
import { type Pengeluaran } from "@prisma/client";

export async function getPengeluaranData(): Promise<Pengeluaran[]> {
  const { data, error } = await supabase
    .from("Pengeluaran")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Error mengambil data pengeluaran:", error);
    throw new Error("Gagal mengambil data pengeluaran");
  }

  return data || [];
}

export async function getPengeluaranById(id: number): Promise<Pengeluaran | null> {
  const { data, error } = await supabase
    .from("Pengeluaran")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error mengambil data pengeluaran:", error);
    throw new Error("Gagal mengambil data pengeluaran");
  }

  return data;
}

export async function createPengeluaran(
  pengeluaran: Omit<Pengeluaran, "id" | "createdAt" | "updatedAt">
): Promise<Pengeluaran> {
  const { data, error } = await supabase
    .from("Pengeluaran")
    .insert([pengeluaran])
    .select()
    .single();

  if (error) {
    console.error("Error membuat pengeluaran:", error);
    throw new Error("Gagal membuat pengeluaran");
  }

  return data;
}

export async function updatePengeluaran(
  id: number,
  pengeluaran: Partial<Omit<Pengeluaran, "id" | "createdAt" | "updatedAt">>
): Promise<Pengeluaran> {
  const { data, error } = await supabase
    .from("Pengeluaran")
    .update(pengeluaran)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error mengupdate pengeluaran:", error);
    throw new Error("Gagal mengupdate pengeluaran");
  }

  return data;
}

export async function deletePengeluaran(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("Pengeluaran")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error menghapus pengeluaran:", error);
    throw new Error("Gagal menghapus pengeluaran");
  }

  return true;
}

export async function getPengeluaranBulanan(tahun: number, bulan: number): Promise<number> {
  const start = `${tahun}-${bulan.toString().padStart(2, "0")}-01`;
  const end = new Date(tahun, bulan, 1).toISOString().split("T")[0]; 

  const { data, error } = await supabase
    .from("Pengeluaran")
    .select("jumlah")
    .gte("tanggal", start)
    .lt("tanggal", end);

  if (error) {
    console.error("Error mengambil total pengeluaran bulanan:", error);
    throw new Error("Gagal mengambil total pengeluaran bulanan");
  }

  return data?.reduce((total, item) => total + item.jumlah, 0) || 0;
}

export async function getPengeluaranTahunan(tahun: number): Promise<number> {
  const { data, error } = await supabase
    .from("Pengeluaran")
    .select("jumlah")
    .gte("tanggal", `${tahun}-01-01`)
    .lt("tanggal", `${tahun + 1}-01-01`);

  if (error) {
    console.error("Error mengambil total pengeluaran tahunan:", error);
    throw new Error("Gagal mengambil total pengeluaran tahunan");
  }

  return data?.reduce((total, item) => total + item.jumlah, 0) || 0;
}
