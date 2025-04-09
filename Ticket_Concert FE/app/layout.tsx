"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  useEffect(() => {
    let title = "MelodiaX.vn"; 
    switch (pathname) {
      case "/":
        title = "Trang Chủ - MelodiaX.vn";
        break;  
      case "/Organizer":
        title = "Ban tổ chức sự kiện - MelodiaX.vn";
        break;
      case "/Admin":
        title = "Quản trị hệ thống - MelodiaX.vn";
        break;
      default:
        title = "MelodiaX.vn";
    }
    document.title = title;
  }, [pathname]);

  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
