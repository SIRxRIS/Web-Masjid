// src/lib/services/supabase/dashboard/dashboard-client.ts
import { createClient } from "@/lib/supabase/client";
import { getTotalKotakAmal } from "../kotak-amal";
import { getKotakAmalMasjidTahunan } from "../kotak-amal-masjid";
import { getTotalKontenPublished } from "../konten";

// Definisi enum SumberPemasukan
export const SUMBER_PEMASUKAN = [
  "DONATUR",
  "KOTAK_AMAL_LUAR",
  "KOTAK_AMAL_MASJID",
  "DONASI_KHUSUS",
  "LAINNYA",
] as const;

export type SumberPemasukan = (typeof SUMBER_PEMASUKAN)[number];

// Fungsi untuk mendapatkan pemasukan tahunan (client-side)
async function getPemasukanTahunanClient(tahun: number): Promise<number> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("Pemasukan")
      .select("jumlah")
      .eq("tahun", tahun);

    if (error) {
      console.error("Error mengambil pemasukan tahunan:", error);
      throw new Error("Gagal mengambil pemasukan tahunan");
    }

    return data.reduce((total, item) => total + (item.jumlah || 0), 0);
  } catch (error) {
    console.error("Error menghitung pemasukan tahunan:", error);
    throw new Error("Gagal menghitung pemasukan tahunan");
  }
}

// Fungsi untuk mendapatkan pengeluaran tahunan (client-side)
async function getPengeluaranTahunanClient(tahun: number): Promise<number> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("Pengeluaran")
      .select("jumlah")
      .eq("tahun", tahun);

    if (error) {
      console.error("Error mengambil pengeluaran tahunan:", error);
      throw new Error("Gagal mengambil pengeluaran tahunan");
    }

    return data.reduce((total, item) => total + (item.jumlah || 0), 0);
  } catch (error) {
    console.error("Error menghitung pengeluaran tahunan:", error);
    throw new Error("Gagal menghitung pengeluaran tahunan");
  }
}

// Fungsi untuk mendapatkan total kotak amal (client-side)
async function getTotalKotakAmalClient(tahun: number): Promise<number> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("KotakAmal")
      .select("jumlah")
      .eq("tahun", tahun);

    if (error) {
      console.error("Error mengambil kotak amal:", error);
      throw new Error("Gagal mengambil kotak amal");
    }

    return data.reduce((total, item) => total + (item.jumlah || 0), 0);
  } catch (error) {
    console.error("Error menghitung total kotak amal:", error);
    return 0;
  }
}

// Fungsi untuk mendapatkan kotak amal masjid tahunan (client-side)
async function getKotakAmalMasjidTahunanClient(tahun: number): Promise<number> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("KotakAmalMasjid")
      .select("jumlah")
      .eq("tahun", tahun);

    if (error) {
      console.error("Error mengambil kotak amal masjid:", error);
      throw new Error("Gagal mengambil kotak amal masjid");
    }

    return data.reduce((total, item) => total + (item.jumlah || 0), 0);
  } catch (error) {
    console.error("Error menghitung kotak amal masjid:", error);
    return 0;
  }
}

// Fungsi untuk mendapatkan total konten published (client-side)
async function getTotalKontenPublishedClient(): Promise<number> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("Konten")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    if (error) {
      console.error("Error mengambil total konten:", error);
      throw new Error("Gagal mengambil total konten");
    }

    return count || 0;
  } catch (error) {
    console.error("Error menghitung total konten:", error);
    return 0;
  }
}

export async function getDashboardDataClient(tahun: number, bulan: number) {
  try {
    const totalPemasukan = await getPemasukanTahunanClient(tahun);
    const totalPengeluaran = await getPengeluaranTahunanClient(tahun);

    const jumlahDonatur = await getTotalDonaturClient(tahun);

    // Mendapatkan persentase pertumbuhan donatur dibanding bulan sebelumnya
    const pertumbuhanDonatur = await getPertumbuhanDonaturClient(tahun, bulan);

    // Mendapatkan total donasi bulan ini
    const donasiBulanan = await getDonasiBulananClient(tahun, bulan);

    // Mendapatkan persentase pertumbuhan donasi dibanding bulan sebelumnya
    const pertumbuhanDonasi = await getPertumbuhanDonasiClient(tahun, bulan);

    // Mendapatkan total kotak amal dan kotak amal masjid
    const totalKotakAmal = await getTotalKotakAmalClient(tahun);
    const totalKotakAmalMasjid = await getKotakAmalMasjidTahunanClient(tahun);
    const totalGabunganKotakAmal = totalKotakAmal + totalKotakAmalMasjid;

    // Mendapatkan total konten yang dipublish
    const totalKontenPublished = await getTotalKontenPublishedClient();

    const saldo = totalPemasukan - totalPengeluaran;

    // Mendapatkan pertumbuhan dana tahunan dan bulanan
    const pertumbuhanDanaTahunan = await getPertumbuhanDanaTahunanClient(tahun);
    const pertumbuhanDanaBulanan = await getPertumbuhanDanaBulananClient(
      tahun,
      bulan
    );

    return {
      totalPemasukan,
      totalPengeluaran,
      saldo,
      jumlahDonatur,
      pertumbuhanDonatur,
      donasiBulanan,
      pertumbuhanDonasi,
      tahun,
      bulan,
      totalKotakAmal,
      totalKotakAmalMasjid,
      totalGabunganKotakAmal,
      totalKontenPublished,
      pertumbuhanDanaTahunan,
      pertumbuhanDanaBulanan,
    };
  } catch (error) {
    console.error("Error mengambil data dashboard:", error);
    throw new Error("Gagal mengambil data dashboard");
  }
}

// Fungsi untuk mendapatkan jumlah total donatur aktif pada tahun tertentu
async function getTotalDonaturClient(tahun: number): Promise<number> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("Donatur")
      .select("*", { count: "exact", head: true })
      .eq("tahun", tahun);

    if (error) {
      console.error("Error mengambil jumlah donatur:", error);
      throw new Error("Gagal mengambil jumlah donatur");
    }

    return count || 0;
  } catch (error) {
    console.error("Error menghitung total donatur:", error);
    throw new Error("Gagal menghitung total donatur");
  }
}

// Fungsi untuk mendapatkan persentase pertumbuhan donatur
async function getPertumbuhanDonaturClient(
  tahun: number,
  bulanIni: number
): Promise<number> {
  try {
    const supabase = createClient();

    // Menentukan bulan sebelumnya dan tahun sebelumnya
    let bulanSebelumnya = bulanIni - 1;
    let tahunSebelumnya = tahun;

    if (bulanSebelumnya === 0) {
      bulanSebelumnya = 12;
      tahunSebelumnya = tahun - 1;
    }

    // Nama kolom bulan sesuai database
    const namaBulan = getBulanName(bulanIni);
    const namaBulanSebelumnya = getBulanName(bulanSebelumnya);

    // Menghitung donatur aktif bulan ini (yang memiliki nilai donasi > 0)
    const { data: dataBulanIni, error: errorBulanIni } = await supabase
      .from("Donatur")
      .select("id")
      .eq("tahun", tahun)
      .gt(namaBulan, 0);

    if (errorBulanIni) throw errorBulanIni;

    // Menghitung donatur aktif bulan sebelumnya
    const { data: dataBulanSebelumnya, error: errorSebelumnya } = await supabase
      .from("Donatur")
      .select("id")
      .eq("tahun", tahunSebelumnya)
      .gt(namaBulanSebelumnya, 0);

    if (errorSebelumnya) throw errorSebelumnya;

    const donaturBulanIni = dataBulanIni ? dataBulanIni.length : 0;
    const donaturBulanSebelumnya = dataBulanSebelumnya
      ? dataBulanSebelumnya.length
      : 0;

    // Menghitung persentase pertumbuhan
    if (donaturBulanSebelumnya === 0) return 100; // Jika sebelumnya 0, pertumbuhan 100%

    return parseFloat(
      (
        ((donaturBulanIni - donaturBulanSebelumnya) / donaturBulanSebelumnya) *
        100
      ).toFixed(1)
    );
  } catch (error) {
    console.error("Error menghitung pertumbuhan donatur:", error);
    return 0;
  }
}

// Fungsi untuk mendapatkan total donasi bulanan
async function getDonasiBulananClient(
  tahun: number,
  bulan: number
): Promise<number> {
  try {
    const supabase = createClient();
    const namaBulan = getBulanName(bulan);

    const { data, error } = await supabase
      .from("Donatur")
      .select(namaBulan)
      .eq("tahun", tahun);

    if (error) throw error;

    // Jumlahkan semua donasi bulan ini
    return data.reduce((total, item) => {
      return total + ((item[namaBulan as keyof typeof item] as number) || 0);
    }, 0);
  } catch (error) {
    console.error("Error menghitung donasi bulanan:", error);
    return 0;
  }
}

// Fungsi untuk mendapatkan persentase pertumbuhan donasi
async function getPertumbuhanDonasiClient(
  tahun: number,
  bulanIni: number
): Promise<number> {
  try {
    // Menentukan bulan sebelumnya dan tahun sebelumnya
    let bulanSebelumnya = bulanIni - 1;
    let tahunSebelumnya = tahun;

    if (bulanSebelumnya === 0) {
      bulanSebelumnya = 12;
      tahunSebelumnya = tahun - 1;
    }

    const donasiBulanIni = await getDonasiBulananClient(tahun, bulanIni);
    const donasiBulanSebelumnya = await getDonasiBulananClient(
      tahunSebelumnya,
      bulanSebelumnya
    );

    // Menghitung persentase pertumbuhan
    if (donasiBulanSebelumnya === 0) return 100; // Jika sebelumnya 0, pertumbuhan 100%

    return parseFloat(
      (
        ((donasiBulanIni - donasiBulanSebelumnya) / donasiBulanSebelumnya) *
        100
      ).toFixed(1)
    );
  } catch (error) {
    console.error("Error menghitung pertumbuhan donasi:", error);
    return 0;
  }
}

// Fungsi helper untuk mendapatkan nama bulan dalam format database
function getBulanName(bulan: number): string {
  const bulanMap: Record<number, string> = {
    1: "jan",
    2: "feb",
    3: "mar",
    4: "apr",
    5: "mei",
    6: "jun",
    7: "jul",
    8: "aug",
    9: "sep",
    10: "okt",
    11: "nov",
    12: "des",
  };

  return bulanMap[bulan] || "jan";
}

// Fungsi untuk menghitung pertumbuhan dana tahunan
async function getPertumbuhanDanaTahunanClient(tahun: number): Promise<number> {
  try {
    // Ambil total pemasukan tahun ini dan tahun lalu
    const pemasukanTahunIni = await getPemasukanTahunanClient(tahun);
    const pemasukanTahunLalu = await getPemasukanTahunanClient(tahun - 1);

    // Jika tahun lalu tidak ada data, return 100% (pertumbuhan penuh)
    if (pemasukanTahunLalu === 0) return 100;

    // Hitung persentase pertumbuhan
    return parseFloat(
      (
        ((pemasukanTahunIni - pemasukanTahunLalu) / pemasukanTahunLalu) *
        100
      ).toFixed(1)
    );
  } catch (error) {
    console.error("Error menghitung pertumbuhan dana tahunan:", error);
    return 0;
  }
}

// Fungsi untuk menghitung pertumbuhan dana bulanan
async function getPertumbuhanDanaBulananClient(
  tahun: number,
  bulanIni: number
): Promise<number> {
  try {
    // Tentukan bulan dan tahun sebelumnya
    let bulanSebelumnya = bulanIni - 1;
    let tahunSebelumnya = tahun;

    if (bulanSebelumnya === 0) {
      bulanSebelumnya = 12;
      tahunSebelumnya = tahun - 1;
    }

    const pemasukanBulanIni = await getDonasiBulananClient(tahun, bulanIni);
    const pemasukanBulanLalu = await getDonasiBulananClient(
      tahunSebelumnya,
      bulanSebelumnya
    );

    if (pemasukanBulanLalu === 0) return 100;

    return parseFloat(
      (
        ((pemasukanBulanIni - pemasukanBulanLalu) / pemasukanBulanLalu) *
        100
      ).toFixed(1)
    );
  } catch (error) {
    console.error("Error menghitung pertumbuhan dana bulanan:", error);
    return 0;
  }
}
