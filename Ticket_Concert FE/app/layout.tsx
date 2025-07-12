"use client";
import { useEffect} from "react";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  useEffect(() => {
    let title = "MelodiaX.vn"; 
    switch (pathname) {
      case "/Authen/Login":
        title = "Đăng nhập";
        break;
      case "/":
        title = "Trang Chủ - MelodiaX.vn";
        break;  
      case "/User/My-Infor":
        title = "Thông tin cá nhân";
        break;
      case "/User/Event-Details":
        title = "Chi tiết sự kiện";
        break;
      case "/User/Book-Tickets":
        title = "Đặt vé";
        break;
      case "/User/Checkout-Tickets":
        title = "Checkout hoá đơn mua vé";
        break;
      case "/Organizer/Create-Event/infor-event":
        title = "Ban tổ chức sự kiện";
        break;
      case "/Organizer/Organi-Event/my-event":
        title = "Sự kiện của tôi";
        break;
      case "/Organizer/Rule-Organizer":
        title = "Điều khoản cho ban tổ chức";
        break;
      case "/Organizer/Rule-Organizer/Rule-1":
        title = "Điều khoản 1";
        break;
      case "/Organizer/Rule-Organizer/Rule-2":
        title = "Điều khoản 2";
        break;
      case "/Organizer/Rule-Organizer/Rule-3":
        title = "Điều khoản 3";
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
