"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const TopNav = ({ title }) => {

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatars, setAvatar] = useState('');
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("IDNguoiDung");
      const avatar = localStorage.getItem("AnhNenUser") 
      if (token && userId) {
        setIsLoggedIn(true);
        setAvatar(avatar);
      }
    }, []);

  const handleCreateEvent = () => {
        localStorage.removeItem("uploadedMedia_logo");
        localStorage.removeItem("uploadedMedia_background");
        localStorage.removeItem("uploadedMedia_logoOrganizer");
        localStorage.removeItem("IDSuKien_Organizer_Detail");
        localStorage.removeItem("uploadedMedia_video");
        sessionStorage.clear();
        window.location.href = "/Organizer/Create-Event/infor-event/";
      };
  

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
          setIsLoggedIn(false);
          Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
          window.location.href = "/";
        }
      });
    };

  return (
    <div className="nav ps-3 sticky-top z-3 t-0 d-flex align-items-center justify-content-between">
      <h3 className="mb-0 text-white fw-bold">{title}</h3>
      <div className="right-section d-flex align-items-center gap-3">
        <div onClick={() => handleCreateEvent()}><button className="btn btn-outline-light">Tạo sự kiện</button></div>
         <div className="dropdown">
            <div className="d-flex align-items-center gap-2 p-1" data-bs-toggle="dropdown">
              <div className="w-10">
                <img src={"https://static.ticketbox.vn/avatar.png"} style={{ borderRadius : "50%", width : "2.5rem", height : "2.5rem", objectFit : "cover"}} alt="avatar" />
              </div>
               <span className="fw-bold text-white">Tài khoản</span>
              <i className="bi bi-arrow-down-short text-white"></i>
            </div>
            <ul className="dropdown-menu mt-0" style={{right : "0px", top : "40px"}}>
                  <li><Link className="dropdown-item" href="/Organizer/Organi-Event/my-event"><i className="bi bi-calendar-event"></i> Sự kiện của tôi</Link></li>
                  <li><Link className="dropdown-item" href="/User/My-Infor/"><i className="bi bi-person-circle"></i> Trang cá nhân</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </button>
                  </li>              
              </ul>                                                   
          </div>
      </div>
    </div>
  );
}

export default TopNav;