import { saveAs } from 'file-saver';

export const exportToCSV = (data: any[], filename = "data.csv") => {
    // Cek apakah data tersedia
    if (!data || data.length === 0) {
      console.error("Tidak ada data untuk diekspor ke CSV");
      alert("Tidak ada data untuk diekspor");
      return;
    }
    
    try {
      // Mendapatkan headers dari data pertama
      const headers = Object.keys(data[0]);
      
      // Membuat konten CSV dengan lebih aman
      const rows = data.map(row => {
        return headers.map(header => {
          // Menangani nilai null, undefined, dan tipe data yang berbeda
          const cell = row[header] === null || row[header] === undefined ? '' : row[header];
          // Escape string yang memiliki koma
          const cellStr = typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell;
          return cellStr;
        }).join(',');
      });
      
      // Gabungkan header dan rows
      const csvContent = [headers.join(','), ...rows].join('\n');
      
      // Membuat blob dan mengunduh file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Gunakan FileSaver untuk konsistensi dengan excel.ts
      saveAs(blob, filename);
      console.log("File CSV berhasil diunduh:", filename);
    } catch (error) {
      console.error("Error saat mengekspor ke CSV:", error);
      alert("Terjadi kesalahan saat mengekspor data ke CSV");
    }
  };