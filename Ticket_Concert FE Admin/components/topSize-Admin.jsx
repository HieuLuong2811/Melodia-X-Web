"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

export default function TopSize({title}) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("IDNguoiDung");
    if (token && userId) {
      setIsLoggedIn(true);
    }
  }, []);

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
        localStorage.removeItem("authToken");
        localStorage.removeItem("IDNguoiDung");
        setIsLoggedIn(false);
        Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
        router.push('/Authen/Login');
      }
    });
  };
  

  return (
    <div className="nav sticky-top ps-3 z-3 t-0 d-flex align-items-center justify-content-between">
      <h3 className="mb-0 text-white fw-bold">{title}</h3>
      <div className="right-section d-flex align-items-center gap-3">
        {isLoggedIn ? (
          <div className="dropdown">
            <Link href="/Authen/Login/" className="d-flex align-items-center gap-2 p-1" data-bs-toggle="dropdown">
              <div className="w-10">
                <img src="https://static.ticketbox.vn/avatar.png" className="rounded-circle border p-1" width="32" height="32"/>
              </div>
              <span className="fw-bold text-white">HieuLuong</span>
              <i className="bi bi-arrow-down-short text-white"></i>
            </Link>
            <ul className="dropdown-menu mt-0">
                <li><Link className="dropdown-item d-flex align-items-center gap-2" href="/Admin/My-Infor/"><i className="bi bi-person-circle"></i> Trang cá nhân</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Đăng xuất
                  </button>
                </li>            
            </ul>                                                   
          </div>
        ) : (
            <Link href="/Authen/Login/" className="btn btn-outline-light">
              <i className="bi bi-person"></i> Đăng nhập / Đăng ký
            </Link>
        )}
      </div>
    </div>
  );
}
