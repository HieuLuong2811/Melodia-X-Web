"use client"
import React from "react";
import dynamic from "next/dynamic";
const LeftSidebar = dynamic(() => import("@/app/Organizer/component/LeftSide-Organizer"), { ssr: false });
const TopSidebar = dynamic(() => import("@/app/Organizer/component/topSide-Organizer"), { ssr: false });
import "../style/Home.css"
import Link from "next/link.js";

const MyEvent = () => {
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
                <div id="right" className="bg-black overflow-auto w-100">
                    <TopSidebar title= "Điều khoản cho ban tổ chức"/>
                    <div className="container p-3">
                        <div className="bg-white rounded">
                            <div className="pt-4 ps-4 pb-3 pe-4">
                                <ul className="list-unstyled mt-2 border rounded m-0">
                                    <Link href="/Organizer/Rule-Organizer/Rule-1" target="blank">
                                        <li className="d-flex justify-content-between align-items-center text-dark ps-3 pt-2 pe-4 pb-2">
                                            <p className="m-0">1. Danh mục hàng hoá, dịch vụ cấm kinh doanh</p>
                                            <i className="bi bi-chevron-right"></i>
                                        </li>
                                    </Link>
                                    <Link href="/Organizer/Rule-Organizer/Rule-2" target="blank">
                                        <li className="d-flex justify-content-between align-items-center text-dark ps-3 pt-2 pe-4  pb-2">
                                            <p className="m-0">2. Danh mục hàng hóa, dịch vụ cấm quảng cáo</p>
                                            <i className="bi bi-chevron-right"></i>
                                        </li>
                                    </Link>
                                    <Link href="/Organizer/Rule-Organizer/Rule-3" target="blank">
                                        <li className="d-flex justify-content-between align-items-center text-dark ps-3 pt-2 pe-4 pb-2">
                                            <p className="m-0">3. Quy định kiểm duyệt nội dung &amp; hình ảnh</p>
                                            <i className="bi bi-chevron-right"></i>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );
};

export default MyEvent;
