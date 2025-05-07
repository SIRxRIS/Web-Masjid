import { supabase } from "@/lib/supabase";
import { DonaturData } from "@/components/admin/layout/finance/pemasukan/table-donation/schema";

export async function getDonaturData(tahunFilter?: number): Promise<DonaturData[]> {
  let query = supabase
    .from("Donatur")
    .select("*")
    .order("no", { ascending: true });

  if (tahunFilter) {
    query = query.eq("tahun", tahunFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error mengambil data donatur:", error);
    throw new Error("Gagal mengambil data donatur");
  }

  return data || [];
}

export async function getAvailableTahun(): Promise<number[]> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("tahun")
    .order("tahun", { ascending: false });

  if (error) {
    console.error("Error mengambil data tahun:", error);
    throw new Error("Gagal mengambil data tahun");
  }

  return [...new Set(data.map(item => item.tahun))];
}

export async function updateDonaturOrder(donaturData: DonaturData[]) {
  const updates = donaturData.map((donatur, index) => ({
    id: donatur.id,
    no: index + 1,
  }));

  const { error } = await supabase
    .from("Donatur")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error mengupdate urutan donatur:", error);
    throw new Error("Gagal mengupdate urutan donatur");
  }

  return true;
}

export async function getDonaturById(id: number): Promise<DonaturData | null> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error mengambil data donatur:", error);
    throw new Error("Gagal mengambil data donatur");
  }

  return data;
}

export async function createDonatur(
  donatur: Omit<DonaturData, "id" | "createdAt" | "updatedAt"> & {
    tahun: number;
  }
): Promise<DonaturData> {
  const { data: lastItem, error: lastItemError } = await supabase
    .from("Donatur")
    .select("no")
    .eq("tahun", donatur.tahun)
    .order("no", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastItemError) {
    console.error("Error mengambil nomor terakhir:", lastItemError);
    throw new Error("Gagal mengambil nomor terakhir");
  }

  const nextNo = lastItem ? (lastItem.no || 0) + 1 : 1;
  
  const now = new Date();
  
  const { data, error } = await supabase
    .from("Donatur")
    .insert([{ 
      ...donatur,
      no: nextNo,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Error membuat donatur:", error);
    throw new Error("Gagal membuat donatur");
  }

  return data;
}

/**
 * Fungsi update donatur yang telah diperbaiki
 * untuk menangani sinkronisasi dengan tabel pemasukan
 */
export async function updateDonatur(
  id: number,
  donatur: Partial<Omit<DonaturData, "id" | "createdAt" | "updatedAt">>
): Promise<DonaturData> {
  try {
    // 1. Dapatkan data donatur sebelum diupdate
    const { data: oldDonatur, error: getError } = await supabase
      .from("Donatur")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;

    // 2. Update donatur
    const { data: updatedDonatur, error: updateError } = await supabase
      .from("Donatur")
      .update({
        ...donatur,
        updatedAt: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Hapus semua entri pemasukan yang terkait dengan donatur ini
    // untuk menghindari duplikasi data
    if (donatur.jan !== undefined || donatur.feb !== undefined || 
        donatur.mar !== undefined || donatur.apr !== undefined ||
        donatur.mei !== undefined || donatur.jun !== undefined ||
        donatur.jul !== undefined || donatur.aug !== undefined ||
        donatur.sep !== undefined || donatur.okt !== undefined ||
        donatur.nov !== undefined || donatur.des !== undefined) {
      
      // Hapus entri pemasukan yang terkait dengan donatur ini
      const { error: deletePemasukanError } = await supabase
        .from("Pemasukan")
        .delete()
        .eq("donaturId", id)
        .eq("sumber", "DONATUR");
      
      if (deletePemasukanError) throw deletePemasukanError;
      
      // Persiapkan data untuk insert ulang pemasukan
      const bulanMap = {
        jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, des: 11,
      };
      
      const donaturSekarang = {...oldDonatur, ...donatur};
      const pemasukanRows = Object.entries(bulanMap)
        .filter(([bulan]) => donaturSekarang[bulan] > 0)
        .map(([bulan, index]) => ({
          tanggal: new Date(donaturSekarang.tahun, index, 1).toISOString(),
          sumber: "DONATUR",
          jumlah: donaturSekarang[bulan],
          tahun: donaturSekarang.tahun,
          donaturId: id,
          keterangan: `Donatur bulan ${bulan.toUpperCase()} - ${donaturSekarang.nama}`,
          kotakAmalId: null,
          kotakMasjidId: null,
          donasiKhususId: null
        }));
      
      if (pemasukanRows.length) {
        const { error: insertError } = await supabase
          .from("Pemasukan")
          .insert(pemasukanRows);
        
        if (insertError) throw insertError;
      }
    }

    return updatedDonatur;
  } catch (error) {
    console.error("Error mengupdate donatur:", error);
    throw new Error("Gagal mengupdate donatur");
  }
}

export async function deleteDonatur(id: number): Promise<boolean> {
  try {
    // Hapus terlebih dahulu semua pemasukan terkait donatur
    const { error: deletePemasukanError } = await supabase
      .from("Pemasukan")
      .delete()
      .eq("donaturId", id);
      
    if (deletePemasukanError) throw deletePemasukanError;
    
    const { data: donaturToDelete, error: getError } = await supabase
      .from("Donatur")
      .select("tahun")
      .eq("id", id)
      .single();

    if (getError) throw getError;

    const { error: deleteError } = await supabase
      .from("Donatur")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    const { data: remainingItems, error: getRemainingError } = await supabase
      .from("Donatur")
      .select("id")
      .eq("tahun", donaturToDelete.tahun)
      .order("no", { ascending: true });

    if (getRemainingError) throw getRemainingError;

    if (remainingItems) {
      for (let i = 0; i < remainingItems.length; i++) {
        const { error: updateError } = await supabase
          .from("Donatur")
          .update({ no: i + 1 })
          .eq("id", remainingItems[i].id);

        if (updateError) throw updateError;
      }
    }

    return true;
  } catch (error) {
    console.error("Error menghapus donatur:", error);
    throw new Error("Gagal menghapus donatur");
  }
}

export async function getDonaturBulanan(tahun: number): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des")
    .eq("tahun", tahun);

  if (error) {
    console.error("Error mengambil data donatur bulanan:", error);
    throw new Error("Gagal mengambil data donatur bulanan");
  }

  const result: Record<string, number> = {
    jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0,
    jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0
  };

  data?.forEach(item => {
    for (const [month, value] of Object.entries(item)) {
      if (month in result) {
        result[month] += (value as number) || 0;
      }
    }
  });

  return result;
}

export async function getDonaturTahunan(tahun: number): Promise<number> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des")
    .eq("tahun", tahun);

  if (error) {
    console.error("Error mengambil data donatur tahunan:", error);
    throw new Error("Gagal mengambil data donatur tahunan");
  }

  let total = 0;
  data?.forEach(item => {
    const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    months.forEach(month => {
      total += (item[month as keyof typeof item] as number) || 0;
    });
  });

  return total;
}

export async function getTotalInfaq(tahun: number): Promise<number> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("infaq")
    .eq("tahun", tahun);

  if (error) {
    console.error("Error mengambil total infaq:", error);
    throw new Error("Gagal mengambil total infaq");
  }

  return data?.reduce((total, item) => total + (item.infaq || 0), 0) || 0;
}