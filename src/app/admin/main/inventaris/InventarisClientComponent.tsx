// src/app/admin/main/inventaris/InventarisClientComponent.tsx
"use client";
import { type InventarisData } from "@/components/admin/layout/inventaris/schema";
import { getInventarisData } from "@/lib/services/supabase/inventaris/inventaris";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/layout/inventaris";

export default function InventarisClientComponent() {
  const [inventarisData, setInventarisData] = useState<InventarisData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInventarisData();
        setInventarisData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : (
            <DataTable data={inventarisData} onDataChange={setInventarisData} />
          )}
        </div>
      </div>
    </div>
  );
}
