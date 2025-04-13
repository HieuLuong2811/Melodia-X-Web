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
                    <div className="container">
                    <object title="ticketbox" data="https://salt.tkbcdn.com/ts/ds/71/71/9f/ed68c21a99ea30caff3e1d8da88fc7b9.pdf" type="application/pdf" width="100%" height="100vh" style= {{height: "100vh", width: "100%"}}></object>                
                </div>
                </div>
            </div>
            
        </>
    );
};

export default MyEvent;
