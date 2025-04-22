import { DonaturData, KotakAmalData, DonasiKhususData } from "@/components/admin/layout/finance/pemasukan/table-donation/schema";

export type IntegratedData = {
  id: number;
  no: number;
  nama: string;
  alamat: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
  infaq: number;
  total: number;
  sourceType: 'donatur' | 'kotakAmal' | 'donasiKhusus';
  sourceId: number;
};

export function integrateData(
  donaturData: DonaturData[],
  kotakAmalData: KotakAmalData[],
  donasiKhususData: DonasiKhususData[],
  year: string
): IntegratedData[] {
  const result: IntegratedData[] = [];
  
  const filteredDonasiKhusus = donasiKhususData.filter(donasi => {
    const date = donasi.tanggal instanceof Date ? donasi.tanggal : new Date(donasi.tanggal);
    return date.getFullYear().toString() === year;
  });
  
  donaturData.forEach((donatur, index) => {
    const total = 
      donatur.jan + 
      donatur.feb + 
      donatur.mar + 
      donatur.apr + 
      donatur.mei + 
      donatur.jun + 
      donatur.jul + 
      donatur.aug + 
      donatur.sep + 
      donatur.okt + 
      donatur.nov + 
      donatur.des + 
      donatur.infaq;
      
    result.push({
      id: result.length + 1,
      no: index + 1,
      nama: donatur.nama,
      alamat: donatur.alamat || '',
      jan: donatur.jan,
      feb: donatur.feb,
      mar: donatur.mar,
      apr: donatur.apr,
      mei: donatur.mei,
      jun: donatur.jun,
      jul: donatur.jul,
      aug: donatur.aug,
      sep: donatur.sep,
      okt: donatur.okt,
      nov: donatur.nov,
      des: donatur.des,
      infaq: donatur.infaq,
      total,
      sourceType: 'donatur',
      sourceId: donatur.id
    });
  });
  
  kotakAmalData.forEach((kotakAmal, index) => {
    const total = 
      kotakAmal.jan +
      kotakAmal.feb +
      kotakAmal.mar +
      kotakAmal.apr +
      kotakAmal.mei +
      kotakAmal.jun +
      kotakAmal.jul +
      kotakAmal.aug +
      kotakAmal.sep +
      kotakAmal.okt +
      kotakAmal.nov +
      kotakAmal.des;
      
    result.push({
      id: result.length + 1,
      no: result.length + 1,
      nama: `Kotak Amal: ${kotakAmal.nama}`,
      alamat: kotakAmal.lokasi || '',
      jan: kotakAmal.jan,
      feb: kotakAmal.feb,
      mar: kotakAmal.mar,
      apr: kotakAmal.apr,
      mei: kotakAmal.mei,
      jun: kotakAmal.jun,
      jul: kotakAmal.jul,
      aug: kotakAmal.aug,
      sep: kotakAmal.sep,
      okt: kotakAmal.okt,
      nov: kotakAmal.nov,
      des: kotakAmal.des,
      infaq: 0,
      total,
      sourceType: 'kotakAmal',
      sourceId: kotakAmal.id
    });
  });
  
  const donasiByMonth: Record<string, number> = {
    jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0,
    jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0
  };
  
  const donasiByDonatur: Record<string, {
    nama: string;
    keterangan: string;
    byMonth: Record<string, number>;
    total: number;
    id: number;  
  }> = {};
  
  filteredDonasiKhusus.forEach(donasi => {
    const date = donasi.tanggal instanceof Date ? donasi.tanggal : new Date(donasi.tanggal);
    const month = date.getMonth();
    
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    const monthKey = monthNames[month];
    
    donasiByMonth[monthKey] += donasi.jumlah;
    
    const donaturKey = `${donasi.nama}-${donasi.keterangan}`;
    
    if (!donasiByDonatur[donaturKey]) {
      donasiByDonatur[donaturKey] = {
        nama: donasi.nama,
        keterangan: donasi.keterangan,
        byMonth: {
          jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0,
          jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0
        },
        total: 0,
        id: donasi.id  // Simpan ID
      };
    }
    
    donasiByDonatur[donaturKey].byMonth[monthKey] += donasi.jumlah;
    donasiByDonatur[donaturKey].total += donasi.jumlah;
  });
  
  Object.keys(donasiByDonatur).forEach(key => {
    const donasi = donasiByDonatur[key];
    
    result.push({
      id: result.length + 1,
      no: result.length + 1,
      nama: `Donasi Khusus: ${donasi.nama}`,
      alamat: donasi.keterangan,
      jan: donasi.byMonth.jan,
      feb: donasi.byMonth.feb,
      mar: donasi.byMonth.mar,
      apr: donasi.byMonth.apr,
      mei: donasi.byMonth.mei,
      jun: donasi.byMonth.jun,
      jul: donasi.byMonth.jul,
      aug: donasi.byMonth.aug,
      sep: donasi.byMonth.sep,
      okt: donasi.byMonth.okt,
      nov: donasi.byMonth.nov,
      des: donasi.byMonth.des,
      infaq: 0,
      total: donasi.total,
      sourceType: 'donasiKhusus',
      sourceId: donasi.id  // Gunakan ID yang disimpan
    });
  });
  
  return result.map((item, index) => ({
    ...item,
    no: index + 1
  }));
}

export function getSourceDetail(
  sourceType: 'donatur' | 'kotakAmal' | 'donasiKhusus',
  sourceId: number,
  donaturData: DonaturData[],
  kotakAmalData: KotakAmalData[],
  donasiKhususData: DonasiKhususData[]
) {
  switch (sourceType) {
    case 'donatur':
      return donaturData.find(item => item.id === sourceId);
    case 'kotakAmal':
      return kotakAmalData.find(item => item.id === sourceId);
    case 'donasiKhusus':
      return donasiKhususData.filter(item => item.id === sourceId);
    default:
      return null;
  }
}

export function updateIntegratedData(
  updatedItem: IntegratedData,
  donaturData: DonaturData[],
  kotakAmalData: KotakAmalData[],
  donasiKhususData: DonasiKhususData[]
) {
  const { sourceType, sourceId } = updatedItem;
  
  let updatedDonaturData = [...donaturData];
  let updatedKotakAmalData = [...kotakAmalData];
  let updatedDonasiKhususData = [...donasiKhususData];
  
  switch (sourceType) {
    case 'donatur':
      updatedDonaturData = donaturData.map(item => {
        if (item.id === sourceId) {
          return {
            ...item,
            nama: updatedItem.nama,
            alamat: updatedItem.alamat,
            jan: updatedItem.jan,
            feb: updatedItem.feb,
            mar: updatedItem.mar,
            apr: updatedItem.apr,
            mei: updatedItem.mei,
            jun: updatedItem.jun,
            jul: updatedItem.jul,
            aug: updatedItem.aug,
            sep: updatedItem.sep,
            okt: updatedItem.okt,
            nov: updatedItem.nov,
            des: updatedItem.des,
            infaq: updatedItem.infaq
          };
        }
        return item;
      });
      break;
    case 'kotakAmal':
      updatedKotakAmalData = kotakAmalData.map(item => {
        if (item.id === sourceId) {
          return {
            ...item,
            nama: updatedItem.nama.replace('Kotak Amal: ', ''),
            lokasi: updatedItem.alamat,
            jan: updatedItem.jan,
            feb: updatedItem.feb,
            mar: updatedItem.mar,
            apr: updatedItem.apr,
            mei: updatedItem.mei,
            jun: updatedItem.jun,
            jul: updatedItem.jul,
            aug: updatedItem.aug,
            sep: updatedItem.sep,
            okt: updatedItem.okt,
            nov: updatedItem.nov,
            des: updatedItem.des
          };
        }
        return item;
      });
      break;
  }
  
  return {
    updatedDonaturData,
    updatedKotakAmalData,
    updatedDonasiKhususData
  };
}