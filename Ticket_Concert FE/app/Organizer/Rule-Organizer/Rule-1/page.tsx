"use client"
import React from "react";
import dynamic from "next/dynamic";
const LeftSidebar = dynamic(() => import("@/components/LeftSide-Organizer"), { ssr: false });
const TopSidebar = dynamic(() => import("@/components/topSide-Organizer"), { ssr: false });
import "../../style/Home.css"

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
                    <div className="container px-4 pt-1">
                        <object title="ticketbox" data="https://salt.tkbcdn.com/file_pdf/6.%20Ticketbox_Danh_muc_hang_hoa_dich_cam_kinh_doanh_va_kinh_doanh_co_dieu_kien_19%2012%202023.docx.pdf" type="application/pdf" width="100%" height="100vh" style = {{height: "100dvh", width: "100%"}}></object>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyEvent;
