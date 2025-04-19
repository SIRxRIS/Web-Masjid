import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Missing environment variables" }, { status: 500 });
  }

  try {
    const SPREADSHEET_ID = "1uLGrj8hNxrBi5tYAkAmT2R4q33AVm7CCWHY72Nr8wRA";

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Process data into sections
    let currentSection = '';
    const sections: { [key: string]: any[] } = {};

    rows
      .filter(row => row.get("DONATUR MASJID JAWAAHIRUZZARQA MUTIARA BIRU"))
      .forEach(row => {
        const value = row.get("DONATUR MASJID JAWAAHIRUZZARQA MUTIARA BIRU").trim();
        
        if (/^[IVX]+$/.test(value)) {
          currentSection = value;
          sections[currentSection] = [];
        } else if (currentSection && /^\d+$/.test(value)) {
          // Update these column names to match your spreadsheet's actual headers
          sections[currentSection].push({
            number: value,
            name: row.get("NAMA") || '',  // Update this column name
            address: row.get("ALAMAT") || '',  // Update this column name
            amount: row.get("NOMINAL") || ''  // Update this column name
          });
        }
      });

    return NextResponse.json({
      success: true,
      title: doc.title,
      data: sections
    });
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}