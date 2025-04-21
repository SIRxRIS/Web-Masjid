import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/admin/layout/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Masjid Jawahiruzzarqa",
  description: "Informasi Manajemen Masjid Jawahiruzzarqa",
  icons: {
    icon: [
      {
        url: "/logo-masjid.png",
        sizes: "32x32",
      },
      {
        url: "/logo-masjid.png",
        sizes: "64x64",
      },
      {
        url: "/logo-masjid.png",
        sizes: "192x192",
      },
      {
        url: "/logo-masjid.png",
        sizes: "512x512",
      },
    ],
    apple: {
      url: "/logo-masjid.png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} font-poppins antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
