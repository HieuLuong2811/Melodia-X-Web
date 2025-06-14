"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LeftSidebar() {
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname);
  const [eventId, setEventId] = useState(null); 
  
  useEffect(() => {
    const id = localStorage.getItem("IDSuKien_Organizer_Detail");
    setEventId(id);
  }, []);
  
  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  const menuGroups = [
    {
      title: "Báo cáo",
      items: [
        { href: "/Organizer/Organi-Event/my-event/Dashboard", icon: "fa-chart-pie", label: "Tổng kết" },
        { href: "/Organizer/Organi-Event/my-event/Order-list", icon: "fa-receipt", label: "Danh sách đơn hàng" },
      ],
    },
    {
      title: "Cài đặt sự kiện",
      items: [
        { href: "/Organizer/Organi-Event/my-event/members", icon: "fa-user", label: "Thành viên" },
        { href: `/Organizer/Create-Event/infor-event/?eventId=${eventId}`, icon: "fa-pen", label: "Chỉnh sửa" },
      ],
    },
  ];

  return (
    <>
    <link
       rel="stylesheet" 
       href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
       />
    <div id="left" className="d-flex flex-column w-18 top-0 start-0 text-white bg-dark p-3">
      <Link href="/Organizer" className="d-flex align-items-center mb-4" id="logo">
        <img src="/logo.png" className="d-block cursor-pointer p-1" alt="Logo" width={32} />
        <h3 className="mb-0">Organizer MelodiaX</h3>
      </Link>

      {menuGroups.map((group, idx) => (
        <div key={idx} className="" style={{fontSize : "15px"}}>
          <div className="mb-2 fw-bold" style={{color : "#aeaeae"}}>{group.title}</div>
          <ul className="list-unstyled d-flex flex-column gap-1 fs-5">
            {group.items.map((item) => (
              <li key={item.href} className={`mb-2  ${selected === item.href ? "bg-secondary rounded" : ""}`}>
                <Link href={item.href} className="menu-content d-flex align-items-center text-decoration-none p-3" style={{fontSize : "15px"}} onClick={() => setSelected(item.href)}>
                  <i className={`fas ${item.icon} fs-6 me-2`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </>
  );
}
