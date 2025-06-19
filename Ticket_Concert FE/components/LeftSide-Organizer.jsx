"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";


export default function LeftSidebar() {
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname); 


  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất?",
      text: "Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng dịch vụ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false);
        Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
        window.location.href = "/";
      }
    });
  };

  const homeOrganizer = () => {
    localStorage.removeItem("uploadedMedia_soDoGhe");
    localStorage.removeItem("uploadedMedia_background");
    localStorage.removeItem("uploadedMedia_logo");
    localStorage.removeItem("uploadedMedia_logoOrganizer");
    window.location.href = "/Organizer/Create-Event/infor-event/";
  }

  return (
    <div id="left" className="d-flex flex-column justify-content-between w-18 top-0 start-0">
      <div className="container-fluid d-flex flex-column h-100 p-0">
        <div onClick={homeOrganizer} className="button d-flex align-items-center mb-2 p-3" id="logo">
          <img src="/logo.png" className="d-block cursor-pointer p-1 ps-1 pe-1" alt="Logo" />
          <h3 className="mb-0 ms-1 text-white">Organizer MelodiaX</h3>
        </div>
        <div className="content rounded-0 bg-transparent p-0 overflow-auto position-static">
          <ul className="menu ps-0">
            {[
              { href: "/Organizer/Organi-Event/my-event", icon: "fa-chart-line", label: "Sự kiện của tôi" },
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
        <div className="logout d-flex cursor-pointer"  onClick={handleLogout}>
          <i className="bi bi-box-arrow-right text-white"></i>
          <span className="d-block cursor-pointer b-0 text-white">Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}
