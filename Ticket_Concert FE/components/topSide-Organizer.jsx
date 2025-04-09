"use client";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

export default function TopNav({title}) {
  return (
    <div className="nav ps-3 sticky-top z-3 t-0 d-flex align-items-center justify-content-between">
      <h3 className="mb-0 text-white fw-bold">{title}</h3>
      <div className="right-section d-flex align-items-center gap-3">
        <Link href="/Organizer/"><button className="btn btn-outline-light">Tạo sự kiện</button></Link>
        <div className="dropdown">
            <div className="d-flex align-items-center gap-2 p-1" data-bs-toggle="dropdown">
              <div className="w-10">
                <img src="https://static.ticketbox.vn/avatar.png" className="rounded-circle border p-1" width="32" height="32"/>
              </div>
              <span className="fw-bold text-white">HieuLuong</span>
              <i className="bi bi-arrow-down-short text-white"></i>
            </div>
            <ul className="dropdown-menu mt-0">
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-calendar-event"></i> Sự kiện của tôi</Link></li>
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-person-circle"></i> Trang cá nhân</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-box-arrow-right"></i> Đăng xuất</Link></li>
              </ul>                                                   
          </div>
      </div>
    </div>
  );
}
