"use client"
import React, { useMemo, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import "./product-detail.css";
import Menu from "@/components/Menu.tsx";
import Link from "next/link";
import {suKienDetailsService} from "@/services/SuKienDetails";
import {SuKienDetails} from "@/interfaces/SuKienDetails";
import DisplayEventTime from "@/components/DisplayEventTime";
import EventDetails from "./EventDetails.tsx";

const Footer = dynamic(() => import('@/components/Footer.jsx'), { ssr: false });
const Nav = dynamic(() => import('@/components/Navbar.jsx'), { ssr: false });

export default function Product_details() {
    const MemoizedNav = useMemo(() => <Nav />, []);
    const MemoizedMenu= useMemo(() => <Menu />, []);
    const MemoizedFooter = useMemo(() => <Footer />, []);

    const [openSuat, setOpenSuat] = useState<string | null>(null);
    const [openDetail , setopenDetail] = useState(false);

    const Open = (idSuatDien : string) => {
        setOpenSuat(openSuat === idSuatDien ? null : idSuatDien);
    };

    const [suKien, setSuKien] = useState<SuKienDetails | null>(null);

    useEffect(() => {
        const idSuKien = localStorage.getItem("IDSuKien_User_Detail");
        if (idSuKien) {
            suKienDetailsService.getSuKienById(idSuKien).then((data) => {
              if (data) {
                setSuKien(data);
              }
            });
          }
        }, []);
    if (!suKien) {
        return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
        <p>Đang tải sự kiện...</p>
        <div className="d-flex align-items-center gap-3">
          <div className="loading set_1"></div>
          <div className="loading set_2"></div>
          <div className="loading set_3"></div>
        </div>
      </div>;;
    }
    const firstShow = suKien.suatDiens.length > 0 ? suKien.suatDiens[0] : null;

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
    <div style={{zoom : "0.9"}}>
        {MemoizedNav}
        {MemoizedMenu}

        <div className="box title">
            <div id="banner">
                <div className="container justify-content-center d-flex p-0">
                    <div className="text-wrapper h-100" style={{flex : "1 1 0%"}}>
                        <div id="circle1" className="circle"></div>
                        <div id="circle2" className="circle"></div>
                        
                        <svg className="vertical-dashed" xmlns="http://www.w3.org/2000/svg" width="4" height="100%" fill="none">
                            <path stroke="#27272A" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 10" d="M2 0v1000"></path>
                        </svg>
                        
                        <svg className="vertical-dashed" xmlns="http://www.w3.org/2000/svg" width="4" height="100%" fill="none">
                            <path stroke="#27272A" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 10" d="M2 0v1000"></path>
                        </svg>

                        <div>
                            <p id="title" className="fw-bold fs-4">
                                <strong>{suKien.TenSuKien}</strong>
                            </p>
                            <div id="venue" className="">
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="bi text bi-geo-alt-fill"></i>
                                    <span className="venue-text fs-6 fw-bold" style={{color:" #2DC275"}}>{suKien.DiaDiem}</span>
                                </div>
                            </div>
                            <div className="ps-4">
                                <span className="fw-bold" style={{fontSize : "14px", color: "rgb(196, 196, 207)"}}></span>
                            </div>
                        </div>
                        <div className="price">
                            {firstShow && (
                                <div className="d-flex align-items-baseline mt-3 mb-2 mb-1">
                                <span className="me-2 text-white fs-5 fw-bold">Giá từ</span>
                                <span id="price-value" className="fw-bold me-2" style={{ fontSize: "25px", color: "rgb(45, 194, 117)" }}>
                                    {Intl.NumberFormat("vi-VN").format(
                                        Math.min(...firstShow.loaiVes.map((ve) => parseFloat(ve.GiaVe)))
                                    )}{" "}
                                    đ
                                </span>
                                </div>
                            )}
                            <Link href="#InfoVe" className="w-100 d-flex justify-content-center text-decoration-none">
                                <button type="button" className="btn btn-success w-100">Chọn lịch diễn</button>
                            </Link>           
                        </div>
                    </div>
            
                    <div className="img-wrapper">
                        <img src={suKien.AnhNen} alt="Banner cover"/>
                    </div>
                </div>
            </div>
        </div>

        <div className="event-info">
            <div className="container d-flex justify-content-between gap-4 p-0">
                <div className="left d-flex flex-column gap-4" style= {{width:"80%", borderRadius:" 10px"}}>
                    <div className="p-3 bg-white rounded-3" style={{ boxShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",}}>
                        <h2 className="">Giới thiệu</h2>
                        <div className={`event-details ${openDetail ? 'expanded' : ''}`}>
                            <EventDetails htmlContent={suKien.ThongTinSuKien} />
                        </div>
                        <div className="View-Details d-flex align-items-center gap-2 justify-content-center p-2 mt-3 border-0 w-100" style={{cursor : "pointer"}}
                        onClick={() => setopenDetail(!openDetail)}>
                            <i className={`bi ${openDetail ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            <span>{openDetail? 'Đóng chi tiết' : 'Xem chi tiết'}</span>
                        </div>
                    </div>
                
                    <div id="InfoVe" className="ticket-info text-white bg-dark">
                        <h2 className="text-white p-3  m-0" style={{borderBottom : "1px solid rgb(0, 0, 0)"}}>Thông tin vé</h2>
                        {suKien.suatDiens.map((suat) => (
                            <div key={suat.IDSuatDien} className="text-white rounded">
                                <div className="d-flex p-3 justify-content-between align-items-center" onClick={() => Open(suat.IDSuatDien)} style={{cursor : "pointer"}}>
                                    <div className="p-0">
                                        <div className="d-flex fs-6 gap-2 fw-bold align-items-center">
                                            <span className={`fs-6 text bi ${openSuat === suat.IDSuatDien ? 'bi-chevron-down' : 'bi-chevron-right'}`}> Suất diễn : </span>
                                            <p className="m-0 fs-6">
                                                <DisplayEventTime start={suat.ThoiGianBatDau} end={suat.ThoiGianKetThuc}/>
                                            </p>
                                        </div>            
                                    </div>
                                    <Link href="/User/Book-Tickets/" className="text-decoration-none text-white"
                                        onClick={() => {
                                            const suatInfo = {
                                            IDSuatDien: suat.IDSuatDien,
                                            TenSuKien: suKien.TenSuKien,
                                            DiaDiem: suKien.DiaDiem,
                                            ThoiGianBatDau: suat.ThoiGianBatDau,
                                            ThoiGianKetThuc: suat.ThoiGianKetThuc,
                                            AnhNen: suKien.AnhNen,
                                            };
                                            sessionStorage.setItem("suatInfo", JSON.stringify(suatInfo));
                                        }}>
                                        <button type="button" className="btn btn-success">
                                            Mua vé ngay
                                        </button>
                                    </Link>
                                </div>
                                <div className={`collapse-content ${openSuat === suat.IDSuatDien ? "show" : ""}`}>
                                    {openSuat === suat.IDSuatDien && (
                                        <div className="">
                                            <ul className="list-unstyled text-uppercase m-0">
                                                {suat.loaiVes.map((ve, index) => (
                                                    <li key={ve.IDLoaiVe} className={`ant-collapse-content-box fw-bold align-items-center d-flex justify-content-between p-3 ${index % 2 === 0 ? 'bg-1' : 'bg-2'}`}> 
                                                        <span style={{fontSize : "15px"}}>{ve.TenVe}</span>
                                                        <div>
                                                            <p  className={`fw-bold m-0 ${ve.SoLuongVe == 0 || ve.SoLuongVe == 0
                                                                ? 'text-gray': 'text'}`}>
                                                                {parseInt(ve.GiaVe).toLocaleString("vi-VN")} VND
                                                            </p>
                                                            {ve.SoLuongVe == 0 && (
                                                                <p className="m-0 px-2 py-1 rounded bg-pink">
                                                                    Hết vé
                                                                </p>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-3 ps-3 pe-3">
                        <h5 className="pt-3 pb-3 fs-6 fw-semibold" style={{borderBottom : "1px solid rgb(235, 235, 240)"}}>Ban tổ chức</h5>
                        <div className="d-flex pt-2 pb-3 gap-4">
                            <div className="img col-md-2" style={{height : "170px"}}>
                                <img src={suKien.LogoBanToChuc} className="rounded-3 w-100 h-100" style={{objectFit : "cover"}} alt="" />
                            </div>
                            <div className="" style={{flex  :"1 1 auto"}}>
                                <p className="m-0 fs-5 fw-semibold">{suKien.TenBanToChuc}</p >
                                <p>{suKien.ThongTinBanToChuc}</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="right" style= {{width: "20%", height: "600px"}}>
                    <img src="/imgzalopay.png" className="w-100 h-100 rounded-3" alt=""/>
                </div>
            </div>
            
        </div>
        {MemoizedFooter}
    </div>
    
    </>
  );
};

