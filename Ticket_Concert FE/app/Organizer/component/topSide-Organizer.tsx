"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";
import { ThongBaoService } from "@/services/ThongBao";
import { ThongBao } from "@/interfaces/ThongBao";

interface TopNavProps {
  title: string;
}

const TopNav = ({ title }: TopNavProps) => {
  const [avatars, setAvatar] = useState("");

  const [thongBaos, setThongBaos] = useState<ThongBao[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("IDNguoiDung");
    const avatar = localStorage.getItem("AnhNenUser");
    if (token && userId) {
      setAvatar(avatar ?? "");
      if (userId) {
        const fetchThongBao = async () => {
          const data = await ThongBaoService.GetThongBaoByIDuser(userId);
          setThongBaos(data);
        };
        fetchThongBao();
      }
    }
  }, [thongBaos]);

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
        Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="nav ps-3 sticky-top z-3 t-0 d-flex align-items-center justify-content-between">
      <h3 className="mb-0 text-white fw-bold">{title}</h3>
      <div className="right-section d-flex align-items-center gap-3">
        <div className="dropdown me-4">
          <div className="btn text-white dropdown-toggle px-0">
            <i className="bi bi-bell-fill fs-3 position-relative"></i>
            {thongBaos.filter(tb => tb.TrangThai === "Chưa đọc").length > 0 && (
              <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger" style={{top :"10px"}}>
                {thongBaos.filter(tb => tb.TrangThai === "Chưa đọc").length}
              </span>
            )}
          </div>

          <ul className="dropdown-menu dropdown-menu-start p-0" style={{ minWidth: "300px", right: "0px", overflowY: "auto" }}>
            {thongBaos.length === 0 ? (
              <li className="text-center text-muted">Không có thông báo nào</li>
            ) : (
              thongBaos.filter(tb => tb.TrangThai).slice(0, 5).map((item, index) => (
                <li key={index} className="border m-0">
                  <div className={`dropdown-item d-flex shadow-sm flex-column ${item.TrangThai === "Chưa đọc" ? "fw-bold bg-light" : ""}`}
                    style={{ padding: "10px", overflowY :"hidden"}}>
                    <div className="d-flex align-items-center w-100">
                      <span className="text-truncate" title={item.TieuDe}>
                        {item.TieuDe}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <small className={`mt-1 ${item.TrangThai === "Chưa đọc" ? "text-danger" : "text-muted"}`}>
                        {item.TrangThai}
                      </small>
                      <small className="text-muted text-nowrap">
                        {new Date(item.NgayTao).toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric"})}
                      </small>
                    </div>
                  </div>
                </li>
              ))
            )}
            <div className="text-center my-2">
              <button className="btn btn-outline-primary btn-sm">Xem thêm</button>
            </div>
          </ul>
        </div>
        <div onClick={() => handleCreateEvent()}>
          <button className="btn btn-outline-light">Tạo sự kiện</button>
        </div>
        <div className="dropdown">
          <div
            className="d-flex align-items-center gap-2 p-1"
            data-bs-toggle="dropdown"
          >
            <div className="w-10">
             {avatars ? (
                <img
                  src={avatars}
                  style={{
                    borderRadius: "50%",
                    width: "2.5rem",
                  }}
                />
              ) : null}
            </div>
            <span className="fw-bold text-white">Tài khoản</span>
            <i className="bi bi-arrow-down-short text-white"></i>
          </div>
          <ul
            className="dropdown-menu mt-0"
            style={{ right: "0px", top: "40px" }}
          >
            <li>
              <Link
                className="dropdown-item"
                href="/Organizer/Organi-Event/my-event"
              >
                <i className="bi bi-calendar-event"></i> Sự kiện của tôi
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" href="/User/My-Infor/">
                <i className="bi bi-person-circle"></i> Trang cá nhân
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i> Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
