import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], filename = "data.xlsx") => {
  // Cek apakah data tersedia
  if (!data || data.length === 0) {
    console.error("Tidak ada data untuk diekspor ke Excel");
    alert("Tidak ada data untuk diekspor");
    return;
  }
  
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, filename);
    console.log("File Excel berhasil diunduh:", filename);
  } catch (error) {
    console.error("Error saat mengekspor ke Excel:", error);
    alert("Terjadi kesalahan saat mengekspor data ke Excel");
  }
};
