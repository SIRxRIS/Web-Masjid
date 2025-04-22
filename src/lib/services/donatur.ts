import { supabase } from "@/lib/supabase";
import { DonaturData } from "@/components/admin/layout/finance/pemasukan/table-donation/schema";

export async function getDonaturData(): Promise<DonaturData[]> {
  const { data, error } = await supabase
    .from("Donatur")
    .select("*")
    .order("no", { ascending: true });

  if (error) {
    console.error("Error fetching donatur data:", error);
    throw new Error("Failed to fetch donatur data");
  }

  return data || [];
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
    console.error("Error updating donatur order:", error);
    throw new Error("Failed to update donatur order");
  }

  return true;
}
