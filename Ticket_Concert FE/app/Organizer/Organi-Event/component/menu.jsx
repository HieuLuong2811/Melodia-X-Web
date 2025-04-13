"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LeftSidebar() {
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname); 


  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <div id="left" className="d-flex flex-column justify-content-between w-18 top-0 start-0">
      <div className="container-fluid d-flex flex-column h-100 p-0">
        <Link href="/Organizer" className="button d-flex align-items-center mb-2 p-3" id="logo">
          <img src="/logo.png" className="d-block cursor-pointer p-1 ps-1 pe-1" alt="Logo" />
          <h3 className="mb-0 ms-1">Organizer MelodiaX</h3>
        </Link>
        <div className="content rounded-0 bg-transparent p-0 overflow-auto position-static">
          <ul className="menu ps-0">
            {[
              { href: "/Organizer/Organi-Event/my-event", icon: "fa-chart-line", label: "Sự kiện của tôi" },
              { href: "/Organizer/account", icon: "fa-user", label: "Quản lý giao dịch" },
              { href: "/Organizer/Rule-Organizer", icon: "fa-server", label: "Điều khoản cho ban tổ chức" },
            ].map((item) => (
              <li key={item.href} className={`menu-content mb-2 ${selected === item.href ? "selected" : ""}`}>
                <Link href={item.href} className="w-100 d-block">
                  <div className="d-flex gap-2 p-2" onClick={() => setSelected(item.href)}>
                    <i className={`fas ${item.icon} me-2`}></i>
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="logout d-flex cursor-pointer">
          <i className="bi bi-box-arrow-right text-white"></i>
          <span className="d-block cursor-pointer b-0 text-white">Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}
