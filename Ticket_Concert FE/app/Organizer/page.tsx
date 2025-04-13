"use client";
import React from "react";
import "./style/Home.css";
import dynamic from "next/dynamic";
const LeftSidebar = dynamic(() => import("@/components/LeftSide-Organizer"), { ssr: false });
const TopSidebar = dynamic(() => import("@/components/topSide-Organizer"), { ssr: false });
import Event from "../Organizer/Create-Event/infor-event/page";


export default function event() {
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
      <div className="d-flex" style={{height : "100%"}}>
      < LeftSidebar />
        <div id="right" className="bg-black overflow-auto">	
          < TopSidebar title = "Thông tin sự kiện"/>
          <Event />
        </div>
      </div>
    </>
  );
}

