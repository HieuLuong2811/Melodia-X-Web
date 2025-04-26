"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { suKienService } from "@/services/SuKien";
// import {SoLuongSuKiens} from "@/interfaces/SuKien";
  
export default function LeftSidebar_Admin() {

    const [counts, setCount] = useState<number>(0);
    useEffect(() => {
        const fetchCount = async () => {
            const data = await suKienService.CountSuKiens();
            setCount(data.length); 
        };
        fetchCount();
      }, []);
      
    const router = useRouter();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (menuName : string) => {
        setOpenDropdown((prev) => (prev === menuName ? null : menuName));
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
            localStorage.removeItem("authToken");
            localStorage.removeItem("IDNguoiDung");
            Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
            router.push('/Authen/Login');
          }
        });
      };

    return (
        <>
           <link 
            rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        />
            <link
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <div id="left" className="position-absolute bg-white top-0 start-0 h-100">
            <div className="container h-100 w-100 d-flex flex-column justify-content-between">
                <Link href= "/" className="button p-3 pb-0" data-tab="Home" id="logo">
                    <img id="logo_1" src="/logo.png" alt="Logo"/>
                    <img id="logo_2" src="/logo_1.png" alt="" />
                </Link>
                <div className="content">
                    <div className="content-1">
                        <h3 className="title">
                            <span id="một">Danh mục sự kiện</span>
                            <span id="hai">---</span>
                        </h3>
                        <ul className="menu ps-0">
                            <li className="menu-content">
                                <Link href="/Admin/OrderEvent">
                                    <div className="button">
                                        <div className="content-body">
                                            <i className="fa fa-cart-plus fs-5"></i>
                                            <span>Tạo sự kiện</span>
                                            <p className="m-0 text-white fw-bold rounded-pill shadow-sm text-center px-3 py-1"
                                                style={{ background: "linear-gradient(45deg, #dc3545, #ff6b6b)",fontSize: "1.1rem", minWidth: "20px"}}>
                                            {counts}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="content-2">
                        <h3 className="title">
                            <span id="một">Danh mục quản lý</span>
                            <span id="hai">---</span>
                        </h3>
                        <ul className="menu ps-0">
                            <li className="menu-content">
                                <Link href="/Admin/Event-Management/">
                                    <div className="button" data-tab="ThongKe">
                                        <div className="content-body">
                                            <i className="fas fa-music"></i>
                                            <span> Danh sách sự kiện</span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="menu-content">
                                <Link href="/Admin/user">
                                    <div className="button" data-tab="ThongKe">
                                        <div className="content-body">
                                            <i className="fas fa-users"></i>
                                            <span>Thông tin khách hàng</span>
                                        </div>
                                    </div>
                                </Link>
                            </li>       
                            <li className="menu-content">
                                <Link href= "/">
                                    <div className="button" data-tab="ThongKe">
                                        <div className="content-body">
                                            <i className="fas fa-chart-line"></i>
                                            <span>Thống kê, báo cáo</span>
                                        </div>
                                    </div>
                                </Link>                              
                            </li>
                        </ul>
                    </div>
                    <div className="content-3" >
                        <h3 className="title">
                            <span id="một">Cài đặt</span>
                            <span id="hai">---</span>
                        </h3> 
                        <ul className="menu ps-0">
                            <li className="menu-content" onClick={() => toggleDropdown("taikhoan")}>
                                <Link href= "#">
                                    <div className="content-body" >
                                        <i className="fas fa-user"></i>
                                        <span>Tài khoản</span>
                                        <i className="bi bi-arrow-down"></i>
                                    </div>
                                </Link>
                                {openDropdown === "taikhoan" && (
                                    <div className={`dropdown-content ${openDropdown === "taikhoan" ? "show" : ""}`}>
                                        <ul>
                                            <li><Link href="/Admin/My-Infor/"><span>Thông tin cá nhân</span></Link></li>
                                            <li><Link href="#"><span>Quên mật khẩu</span></Link></li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                            <li className="menu-content" onClick={() => toggleDropdown("hethong")}>
                                <Link href= "#">
                                    <div className="content-body">
                                        <i className="fas fa-server"></i>
                                        <span>Hệ thống</span>
                                        <i className="bi bi-arrow-down"></i>
                                    </div>
                                </Link>
                                {openDropdown === "hethong" && (
                                    <div className={`dropdown-content ${openDropdown === "hethong" ? "show" : ""}`}>
                                        <ul>
                                            <li><a href=""><span>Cấu hình hệ thống</span></a></li>
                                            <li><a href=""><span>Cập nhật phần mềm</span></a></li>
                                            <li><a href=""><span>Giám sát hệ thống</span></a></li>
                                            <li><a href=""><span>Dự phòng và phục hồi</span></a></li>
                                            <li><a href=""><span>Báo cáo hệ thống</span></a></li>
                                        </ul>
                                    </div>
                                )}
                                
                            </li>
                            <li className="menu-content" onClick={() => toggleDropdown("baotri")}>
                                <Link href= "#">
                                    <div className="content-body">
                                        <i className="fas fa-tools"></i>
                                        <span>Bảo trì</span>
                                        <i className="bi bi-arrow-down"></i>
                                    </div>
                                </Link>
                                {openDropdown === "baotri" && (
                                    <div className={`dropdown-content ${openDropdown === "baotri" ? "show" : ""}`}>
                                        <ul>
                                            <li><Link href="#"><span>Lịch bảo trì</span></Link></li>
                                            <li><Link href="#"><span>Kiểm tra và sửa chữa</span></Link></li>
                                            <li><Link href="#"><span>Quản lý thiết bị</span></Link></li>
                                            <li><Link href="#"><span>Cập nhật bảo trì</span></Link></li>
                                            <li><Link href="#"><span>Dịch vụ và hỗ trợ</span></Link></li>
                                            <li><Link href="#"><span>Báo cáo bảo trì</span></Link></li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>               
                </div>	
                <div className="logout fs-5 d-flex gap-2 border-top" onClick={() => handleLogout()}>
                    <i className='bi bi-box-arrow-right'></i> 
                    <span>Đăng xuất</span>
                </div>			
            </div>
        </div>
        </>
    );
  }