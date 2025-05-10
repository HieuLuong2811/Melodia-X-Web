"use client"
import React, { useEffect, useState } from "react";
import LeftSidebar from "@/components/LeftSide-Organizer.jsx";
import TopSidebar from "@/components/topSide-Organizer.jsx";
import "./style.css";
import "../../style/Home.css";
import "slick-carousel/slick/slick.css";
import EmptyData from "@/components/emptydata";
import "slick-carousel/slick/slick-theme.css";
import { suKienService } from "@/services/SuKien";
import { SuKien } from "@/interfaces/SuKien";
import Link from "next/link";
import { Tabs, Tab, TextField} from '@mui/material';


const MyEvent = () => {
    const [suKiens, setSuKiens] = useState<SuKien[]>([]);
    const [activeTab, setActiveTab] = useState('Chờ xác nhận');

    const [searchName, setSearchName] = useState('');
    const statusOptions: SuKien["TrangThaiSuKien"][] = [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Chưa bắt đầu",
        "Đang diễn ra",
        "Hoàn thành",
        "Hủy",
      ];

    const handleClick = (() => {
        localStorage.removeItem("uploadedMedia_logo");
        localStorage.removeItem("uploadedMedia_background");
        localStorage.removeItem("uploadedMedia_logoOrganizer");
        localStorage.removeItem("uploadedMedia_video");
    });

    useEffect(() => {
        const IDNguoiDung = localStorage.getItem("IDNguoiDung");
        if (IDNguoiDung) {
            suKienService.getSuKienByIdUser(IDNguoiDung).then((data) => {
                if (data) {
                    const result = Array.isArray(data) ? data : [data];
                    setSuKiens(result);
                }
            });
        }
    }, []);  

    const filteredSukiens = suKiens.filter((sukien) => {
        const tenSuKien = sukien?.TenSuKien?.toLowerCase() || "";
        // const diaDiem = sukien?.DiaDiem?.toLowerCase() || "";
        const trangThai = sukien?.TrangThaiSuKien || "";
        // const thoiGian = sukien?.ThoiGianBatDau?.substring(0, 10); 
      
        const matchName = tenSuKien.includes(searchName.toLowerCase());
        // const matchLocation = diaDiem.includes(searchLocation.toLowerCase());
        // const matchDate = !searchDate || thoiGian === searchDate;
        const matchStatus = trangThai === activeTab;
      
        return matchName && matchStatus;
      });

    if (!suKiens) {
        return (
            <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
                <p>Đang tải sự kiện...</p>
                <div className="d-flex align-items-center gap-3">
                    <div className="loading set_1"></div>
                    <div className="loading set_2"></div>
                    <div className="loading set_3"></div>
                </div>
            </div>
        );
    }

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
                    <TopSidebar title="Sự kiện của tôi" />
                    <div className="d-flex w-100 m-0">
                        <div className="container-fluid text-white min-vh-100 pt-2 p-4"
                            style={{ background: "linear-gradient(rgb(19, 36, 27), rgb(37 15 33))"}}>
                            <div className="d-flex pt-3 pb-3 align-items-center justify-content-between gap-1" style={{ height: "75px" }}>
                                <div className="search col-md-3">
                                    <TextField label="Tìm kiếm tên" className="rounded-3 bg-light" fullWidth variant="outlined" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                                </div>  
                                <div className="col-md-7">
                                    <Tabs
                                        value={activeTab}
                                        onChange={(e, newValue) => setActiveTab(newValue)}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="scrollable"
                                        scrollButtons="auto">
                                        {statusOptions.map((status, index) => (
                                            <Tab sx={{padding : "10px", borderRadius : "10px"}} key={index} label={status} value={status}/>
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between w-100 flex-wrap mt-5">
                                {filteredSukiens.length > 0 ? (
                                    filteredSukiens.map((suKien) => (
                                        <div key={suKien.IDSuKien} className="row col-md-6 p-3">
                                            <div className="p-3 d-flex rounded-top-4 gap-4"
                                                style={{ backgroundColor: "rgb(40 43 51)" }}>
                                                <div className="col-md-6">
                                                    <img src={`${suKien.AnhNen}?t=${new Date().getTime()}`} alt="Logo" loading="lazy" style={{ width: "300px", height: "150px", objectFit: "cover", borderRadius: "8px"}}/>
                                                </div>
                                                <div className="col-md-5 fw-bold">
                                                    <h5 className="text-white mb-4" style={{ height: "45px", overflow: "hidden" }}> Tên sự kiện: {suKien.TenSuKien}
                                                    </h5>
                                                    <div style={{ fontSize: "13px" }} className="d-flex flex-column gap-2">
                                                        <span className="d-flex align-items-center gap-2">
                                                            <i className="bi bi-calendar-fill"></i>
                                                            <span style={{ color: "rgb(45, 194, 117)" }}>
                                                                2022-01-10
                                                            </span>
                                                        </span>
                                                        <span className="d-flex align-items-center gap-2">
                                                            <i className="bi bi-geo-alt-fill"></i>
                                                            <span
                                                                style={{
                                                                    color: "rgb(45, 194, 117)",
                                                                    height: "40px",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                {suKien.DiaDiem}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul
                                                className="d-flex list-unstyled rounded-bottom-4 justify-content-center gap-5 p-2"
                                                style={{ backgroundColor: "#414652", fontSize: "14px" }}>
                                                <li className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-peace-fill"></i>
                                                    <Link href="/Organizer/Organi-Event/my-event/Dashboard/"
                                                        onClick={() => { handleClick(); localStorage.setItem( "IDSuKien_Organizer_Detail", suKien.IDSuKien );}}>
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
                                    <div className="sc-ffc90067-7 sc-cd78c11b-1 fFJbAL ePwTxf  flex-column  text-center w-100 d-flex justify-content-center">
                                        <EmptyData />
                                        <div className="sc-cd78c11b-2 cimqQp fw-bold mt-3">Không có sự kiện</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyEvent;
