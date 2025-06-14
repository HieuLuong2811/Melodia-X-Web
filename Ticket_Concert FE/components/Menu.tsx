"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LoaisuKienService } from "../services/LoaiSuKien";
import { LoaiSuKien } from "../interfaces/LoaiSuKien";

export default function Menu() {

  const [type, setType] = useState<LoaiSuKien[]>([]);

  useEffect(() => {
    const fetchLoaiSuKien = async () => {
      try {
        const data = await LoaisuKienService.getAllLoaiSuKiens();
        setType(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách LoaiSuKien:", error);
      }

    };
    fetchLoaiSuKien();
  }, []);

  return (
    <div className="text-white" style={{ backgroundColor: "#000000" }}>
      <div className="container d-flex justify-content-between align-items-center ps-3 pe-3" style={{ height: "70px" }}>
        <div className="d-flex gap-4">
          {type.map((loaiSK) => (
            <Link key={loaiSK.IDLoaiSuKien} href="/User/Event-List/" style={{}} className="text-white text-decoration-none">
              {loaiSK.TenLoai}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}