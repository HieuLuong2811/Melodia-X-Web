"use client";
import React, { useEffect } from "react";
import "./style/Home.css";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
const LeftSidebar = dynamic(() => import("@/components/LeftSide-Organizer"), { ssr: false });
import TopSidebar from "@/components/topSide-Organizer";
import EventForm from "../Organizer/Create-Event/infor-event/page";


const Event = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if(!token) {
      router.push('/Authen/Login');
    }
  },[]);

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
          <EventForm />
        </div>
      </div>
    </>
  );
}

export default Event;