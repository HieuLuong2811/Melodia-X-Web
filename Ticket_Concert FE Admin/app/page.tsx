'use client'
import React, { useEffect } from "react";
import dynamic from 'next/dynamic'
const LeftSide = dynamic(() => import('@/components/LeftSide-Admin'), { ssr: false })
const TopSize = dynamic(() => import('@/components/topSize-Admin.jsx'), { ssr: false })
import "./globals.css";
import Dashboard from "./Admin/DashBoard/page";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
   useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("IDNguoiDung");
      if (!token || !userId) {
        router.push('/Authen/Login/');
      }
    }, []);

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <link
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <main className="flex-1 d-flex flex flex-col gap-8 row-start-2 items-center sm:items-start" style={{ backgroundColor: "#27272A" }}>
        <LeftSide />
        <div id="right" className="overflow-auto" style={{ backgroundColor: "#F5F7FD" }}>
          <TopSize title="📊 Thống kê quản trị hệ thống" />
          <div className="p-4" style={{ width: "100% !important" }}>
            <Dashboard />
          </div>
        </div>
      </main>
    </>
  );
}
