"use client"
import React, {useEffect, useState } from "react";
import LeftSidebar from "@/components/LeftSide-Organizer.jsx";
import TopSidebar from "@/components/topSide-Organizer.jsx";
import "./style.css";
import "../../style/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { suKienService } from "@/services/SuKien";
import { SuKien } from "@/interfaces/SuKien";
import Link from "next/link";

const MyEvent = () => {
    const [activeTab, setActiveTab] = useState("cho-xac-nhan");
    
    const [suKiens, setSuKiens] = useState<SuKien[]>([]);    

    useEffect(() => {
        const IDNguoiDung = localStorage.getItem("IDNguoiDung");
        if(IDNguoiDung) {
            suKienService.getSuKienByIdUser(IDNguoiDung).then((data) => {
                if(data) {
                    const result = Array.isArray(data) ? data : [data];
                    setSuKiens(result);
                }
            })
        }
    }, []);
    if(!suKiens) {
        return<div className="loading-wrapper d-flex flex-column align-items-center gap-2">
        <p>Đang tải sự kiện...</p>
        <div className="d-flex align-items-center gap-3">
          <div className="loading set_1"></div>
          <div className="loading set_2"></div>
          <div className="loading set_3"></div>
        </div>
      </div>;;
    }
    const tab = [
        { id: "cho-xac-nhan", label: "Chờ xác nhận" },
        { id: "chua-bat-dau", label: "Chưa bắt đầu" },
        { id: "dang-dien-ra", label: "Đang diễn ra" },
        { id: "hoan-thanh", label: "Hoàn thành" },
        { id: "huy", label: "Hủy" }
    ];


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
            <div className="d-flex">
                <LeftSidebar />
                <div id="right" className="my-event bg-black overflow-auto w-100">
                    <TopSidebar title= "Sự kiện của tôi"/>
                    <div className="container d-flex w-100" style={{background: "linear-gradient(rgb(19, 36, 27), rgb(37, 15, 33))"}}>
                        <div className="container-fluid text-white min-vh-100 pt-2 p-4">
                            <div className="d-flex pt-3 pb-3 justify-content-between gap-1" style={{height : "75px"}}>
                                <div className="search col-md-3">
                                    <input type="search" className="w-100 h-100 ps-3 form-control form rounded-3 form-control-sm" placeholder="Nhập thông tin tìm kiếm..."/>
                                </div>
                                <ul className="d-flex col-md-8 p-1 list-unstyled rounded-3 mb-0 nav-tabs nav-line nav-color-secondary justify-content-between p-0" 
                                    style={{ fontSize: "15px", borderBottom: "0.5px solid rgb(93 93 94)", background: "#484848" }} 
                                    role="tablist">
                                    {tab.map((tabItem) => (
                                        <li 
                                            className={`nav-item cursor-pointer rounded submenu d-flex align-items-center justify-content-center text-decoration-none`} 
                                            role="presentation" 
                                            key={tabItem.id} 
                                            onClick={() => setActiveTab(tabItem.id)}
                                            style={{
                                                transition: "0.3s",
                                                backgroundColor: activeTab === tabItem.id ? "#2dc275" : "#484848"
                                            }}>
                                            <button className="fw-bold border-0 bg-transparent nav-link" style={{paddingLeft : "40px", paddingRight : "40px"}}>
                                                {tabItem.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {activeTab === "cho-xac-nhan" && (
                                <div className="d-flex justify-content-between w-100 flex-wrap">
                                    {suKiens.length > 0 ? (
                                        suKiens.map((suKien) => (
                                            <div key={suKien.IDSuKien} className="row col-md-6 p-3">
                                                <div className="p-3 d-flex rounded-top-4 gap-4" style={{ backgroundColor: "rgb(40 43 51)" }}>
                                                    <div className="col-md-6">
                                                        <img src={`${suKien.AnhNen}?t=${new Date().getTime()}`}  alt="Logo" loading="lazy" style={{ width: "300px", height: "150px", objectFit: "cover", borderRadius: "8px" }}/>
                                                    </div>
                                                    <div className="col-md-5 fw-bold">
                                                    <h5 className="text-white mb-4" style={{height: "45px", overflow : "hidden"}}>Tên sự kiện: {suKien.TenSuKien}</h5>
                                                    <div style={{ fontSize: "13px" }} className="d-flex flex-column gap-2">
                                                        <span className="d-flex align-items-center gap-2">
                                                        <i className="bi bi-calendar-fill"></i>
                                                        <span style={{ color: "rgb(45, 194, 117)" }}>2022-01-10 </span>
                                                        </span>
                                                        <span className="d-flex align-items-center gap-2">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                        <span style={{ color: "rgb(45, 194, 117)",height: "40px", overflow : "hidden" }}>{suKien.DiaDiem}</span>
                                                        </span>
                                                    </div>
                                                    </div>
                                                </div>
                                                <ul className="d-flex list-unstyled rounded-bottom-4 justify-content-center gap-5 p-2" style={{ backgroundColor: "#414652", fontSize : "14px" }}>
                                                    <li className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-peace-fill"></i>
                                                        <Link href="/Organizer/Organi-Event/my-event/Dashboard/">
                                                            <span style={{ color: "rgb(45, 194, 117)" }}>Tổng quan</span>
                                                        </Link>
                                                    </li>
                                                    <li className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-person-fill"></i>
                                                        <span style={{ color: "rgb(45, 194, 117)" }}>Thành viên</span>
                                                    </li>
                                                    <li className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-journal-text"></i>
                                                        <span style={{ color: "rgb(45, 194, 117)" }}>Đơn hàng</span>
                                                    </li>
                                                    <li className="d-flex flex-column align-items-center">
                                                    <i className="fas fa-chair fs-5 mt-1 mb-2"></i>
                                                    <span style={{ color: "rgb(45, 194, 117)" }}>Sơ đồ ghế</span>
                                                    </li>
                                                    <li className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-pencil"></i>
                                                    <span style={{ color: "rgb(45, 194, 117)" }}>Chỉnh sửa</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        ))
                                        ) : (
                                        <div className="text-center text-white">
                                            Không có sự kiện
                                        </div>
                                        )}
                                </div> 
                            )}
                            {activeTab === "chua-bat-dau" && <h1>Cài đặt</h1>}
                            {activeTab === "dang-dien-ra" && <h1>Cài đặt</h1>}
                            {activeTab === "hoan-thanh" && <h1>Cài đặt</h1>}
                            {activeTab === "huy" && <h1>Cài đặt</h1>}
                        </div>
                    </div>
                </div>
            </div>         
        </>
    );
};

export default MyEvent;
