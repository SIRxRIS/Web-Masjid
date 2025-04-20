import { supabase } from "@/lib/supabase";
import { DonasiKhususData } from "@/components/layout/finance/pemasukan/table-donation/schema";

export async function getDonasiKhusus(): Promise<DonasiKhususData[]> {
  const { data, error } = await supabase
    .from("DonasiKhusus")
    .select("*")
    .order("no", { ascending: true });

  if (error) {
    console.error("Error fetching donasi khusus data:", error);
    throw new Error("Failed to fetch donasi khusus data");
  }

  return data || [];
}

export async function updateDonasiKhususOrder(dataList: DonasiKhususData[]) {
  const updates = dataList.map((item, index) => ({
    id: item.id,
    no: index + 1,
  }));

  const { error } = await supabase
    .from("DonasiKhusus")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Error updating donasi khusus order:", error);
    throw new Error("Failed to update donasi khusus order");
  }

  return true;
}
