"use client";
import React , {useState, useEffect} from "react";
import Link from "next/link";
import Swal from "sweetalert2";

const Nav = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const suggestions = ["Jisoo", "NTPMM", "Noo Phước Thịnh", "Chị đẹp"];
  const [avatars, setAvatar] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("IDNguoiDung");
    const avatar = localStorage.getItem("AnhNenUser") 
    if (token && userId) {
      setIsLoggedIn(true);
      setAvatar(avatar);
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
        href="https://cdn.jsdelivr.net/npm/flag-icon-css/css/flag-icon.min.css"
      />


      <nav className="navbar navbar-expand-lg navbar-light pt-3 pb-3 position-sticky top-0 z-3">
        <div className="container d-flex align-items-center justify-content-between">
          
          <Link href="/">
            <img src="/logo_User.png" alt="Logo"/>
          </Link>
          
          <div className="form-group">
            <div className="input-icon position-relative d-flex dqshek align-items-center p-1">
              <input type="text" className="form-control w-100" placeholder="Bạn tìm gì hôm nay?"
              onFocus={() => setIsOpen(true)} onBlur={() => setTimeout(() => setIsOpen(false), 200)} onChange={(e) => setSearchTerm(e.target.value)}/>

              {isOpen && searchTerm && (
                <div className={`dropdown-menu show ${styles.dropdownCustom}`}>
                  {suggestions
                    .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <button key={index} className="dropdown-item">
                        {item}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <div className="d-flex align-items-center justify-content-between gap-3 w-100">
              <Link href="/Organizer/" onClick={() => handleCreateEvent()} className="btn btn-outline-light ps-4 pe-4 pt-2 pb-2 rounded-5" target="_blank" rel="noopener noreferrer" style={{width : "150px"}} passHref>
                Tạo sự kiện
              </Link>

              <Link href="/User/My-Infor/" className="d-flex align-items-center text-decoration-none text-white gap-2">
                <i className="bi bi-ticket-detailed fs-3"></i> Vé đã mua
              </Link>

              <div className="dropdown mt-0">
                <button className="btn text-white dropdown-toggle" type="button">
                  <Link href= "/Authen/Login/" className="text-decoration-none text-white" passHref>
                    <img src={avatars} style={{ borderRadius : "50%", width : "2.5rem", height : "2.5rem", objectFit : "cover"}} alt="" /> Tài khoản
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
            </div>
            
          ) : (
            <Link href="/Authen/Login/" className="btn btn-outline-light">
              <i className="bi bi-person"></i> Đăng nhập / Đăng ký
            </Link>
          )}
            
            <div className="dropdown ms-2 w-0">
              <button className="btn text-white dropdown-toggle" type="button">
                <span className="flag-icon flag-icon-vn"></span>
              </button>
              <ul className="dropdown-menu">
                  <li><Link className="dropdown-item d-flex align-items-center gap-2" href="#"><span className="flag-icon flag-icon-vn"></span> Tiếng Việt</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-2" href="#"><span className="flag-icon flag-icon-gb"></span> English</Link></li>
                </ul>
            </div>
          </div>
        </div>
      </nav>
      </>
  );
};

export default Nav;
