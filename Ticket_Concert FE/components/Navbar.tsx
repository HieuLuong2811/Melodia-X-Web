"use client";
import React , {useState, useEffect} from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import { ThongBaoService } from "@/services/ThongBao";
import {ThongBao} from "@/interfaces/ThongBao";
import socket from "@/middleware/socket.io";

const Nav = () => {

  const suggestions = ["Jisoo", "NTPMM", "Noo Phước Thịnh", "Chị đẹp"];
  // const [avatars, setAvatar] = useState('');
  const [thongBaos, setThongBaos] = useState<ThongBao[]>([]); 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const unreadThongBaos = thongBaos.filter(tb => tb.TrangThai === "Chưa đọc");
  const unreadCount = unreadThongBaos.length;

useEffect(() => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("IDNguoiDung");

  if (token && userId) {
    setIsLoggedIn(true);

    // join socket room
    socket.emit("join_room", userId);

    // lấy lịch sử từ socket khi join
    socket.on("init_notifications", (list: ThongBao[]) => {
      console.log("📦 Init notifications:", list);
      setThongBaos(list);
    });

    // realtime noti mới
    socket.on("new_notification", (noti: ThongBao) => {
      console.log("🔥 Noti mới:", noti);
      setThongBaos(prev => [noti, ...prev]);
    });
  }

  return () => {
    socket.off("init_notifications");
    socket.off("new_notification");
  };
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
        localStorage.clear();
        setIsLoggedIn(false);
        Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
        window.location.href = "/";
      }
    });
  };

   const handleCreateEvent = () => {
    localStorage.removeItem("uploadedMedia_logo");
    localStorage.removeItem("uploadedMedia_background");
    localStorage.removeItem("uploadedMedia_logoOrganizer");
    localStorage.removeItem("IDSuKien_Organizer_Detail");
  };
  
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light pt-3 pb-3 position-sticky top-0 z-3">
        <div className="container d-flex align-items-center justify-content-between">
          
          <Link href="/">
            <img src="/logo_User.png" alt="Logo"/>
          </Link>
          
          <Autocomplete
            freeSolo
            options={suggestions}
            onChange={(event, value) => {
              if (value) {
                // router.push(`/search?query=${value}`);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Bạn tìm gì hôm nay?"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "white", borderRadius: "5px", width: 400, height: 40, border: "none" }}
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          />

          <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <div className="d-flex align-items-center justify-content-between gap-3 w-100">
              <Link href="/Organizer/Create-Event/infor-event/" onClick={() => handleCreateEvent()} className="btn btn-outline-light ps-4 pe-4 pt-2 pb-2 rounded-5" target="_blank" rel="noopener noreferrer" style={{width : "150px"}} passHref>
                Tạo sự kiện
              </Link>

              <Link href="/User/My-Infor/" className="d-flex align-items-center text-decoration-none text-white gap-2">
                <i className="bi bi-ticket-detailed fs-3"></i> Vé đã mua
              </Link>

              <div className="dropdown mt-0">
                <button className="btn text-white dropdown-toggle pb-1 pe-0" type="button">
                  <Link href= "/Authen/Login/" className="text-decoration-none d-flex align-items-center gap-1 text-white" passHref>
                    {/* <img src={avatars} style={{ borderRadius : "50%", width : "40px", height : "40px", objectFit : "cover"}} alt="" />  */}
                    Tài khoản
                    <i className="bi bi-arrow-down-short"></i>
                  </Link>
                </button>
                <ul className="dropdown-menu mt-0">
                    <li><Link className="dropdown-item d-flex align-items-center gap-2" href="/User/My-Infor/"><i className="bi bi-ticket-detailed"></i> Vé đã mua</Link></li>
                    <li><Link className="dropdown-item d-flex align-items-center gap-2" target="blank" href="/Organizer/Organi-Event/my-event"><i className="bi bi-calendar-event"></i> Sự kiện của tôi</Link></li>
                    <li><Link className="dropdown-item d-flex align-items-center gap-2" href="/User/My-Infor/"><i className="bi bi-person-circle"></i> Trang cá nhân</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Đăng xuất
                      </button>
                    </li>
                </ul>
              </div>
              <div className="dropdown">
                <div className="mx-3">
                  <button 
                    className="btn text-white dropdown-toggle position-relative px-0" 
                    aria-label={`Có ${unreadCount} thông báo chưa đọc`}
                  >
                    <i className="bi bi-bell-fill fs-3 "></i>
                    {unreadCount > 0 && (
                      <span 
                        className="position-absolute start-100 translate-middle badge rounded-pill bg-danger" 
                        style={{ top: "10px" }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                <ul 
                  className="dropdown-menu dropdown-menu-start p-0 shadow-lg" 
                  style={{ maxWidth: "450px", right: 0, maxHeight: "400px", overflowY: "auto" }}
                  role="alert"
                  aria-live="polite"
                >
                  {thongBaos.length === 0 ? (
                    <li className="text-center text-muted py-2">Không có thông báo nào</li>
                  ) : (
                    thongBaos.slice(0, 5).map((item, index) => (
                      <li key={index} className="border-bottom">
                        <div 
                          className={`dropdown-item d-flex flex-column ${item.TrangThai === "Chưa đọc" ? "bg-light fw-bold" : ""}`}
                          style={{ padding: "10px" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-truncate" title={item.TieuDe}>
                              {item.TieuDe}
                            </span>
                            {item.TrangThai === "Chưa đọc" && <span className="text-danger ms-2">●</span>}
                          </div>
                          <small className="text-muted text-truncate">
                            {item.NoiDung}
                          </small>
                          <div className="d-flex justify-content-between mt-1">
                            <small className="text-muted text-nowrap">
                              {new Date(item.NgayTao).toLocaleDateString("vi-VN", {
                                day: "2-digit", month: "2-digit", year: "numeric"
                              })}
                            </small>
                            <small className={item.TrangThai === "Chưa đọc" ? "text-danger" : "text-muted"}>
                              {item.TrangThai}
                            </small>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                  <li className="text-center my-2">
                    <button className="btn btn-outline-primary btn-sm">Xem thêm</button>
                  </li>
                </ul>
              </div>
            </div>
            
          ) : (
            <Link href="/Authen/Login/" className="btn btn-outline-light">
              <i className="bi bi-person"></i> Đăng nhập / Đăng ký
            </Link>
          )}
            
 
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
