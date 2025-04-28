import { supabase } from "@/lib/supabase";
import { KotakAmalData } from "@/components/admin/layout/finance/pemasukan/table-donation/schema";

export async function getKotakAmalData(): Promise<KotakAmalData[]> {
  const { data, error } = await supabase
    .from("KotakAmal")
    .select("*")
    .order("no", { ascending: true });

  if (error) {
    console.error("Error fetching kotak amal data:", error);
    throw new Error("Failed to fetch kotak amal data");
  }

  return data || [];
}

export async function updateKotakAmalOrder(kotakAmalData: KotakAmalData[]) {
  const updates = kotakAmalData.map((item, index) => ({
    id: item.id,
    no: index + 1,
  }));

  const { error } = await supabase
    .from("KotakAmal")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error updating kotak amal order:", error);
    throw new Error("Failed to update kotak amal order");
  }

  return true;
}

export async function getTotalKotakAmal(): Promise<number> {
  const { data, error } = await supabase
    .from("KotakAmal")
    .select("nominal");

  if (error) {
    console.error("Error fetching kotak amal total:", error);
    throw new Error("Failed to fetch kotak amal total");
  }

  return data?.reduce((total, item) => total + (item.nominal || 0), 0) || 0;
}
