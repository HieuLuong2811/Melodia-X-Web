'use client';
import React, { useState, useEffect } from "react";
import { suKienService } from "@/services/SuKien";
import { SuKien } from "@/interfaces/SuKien";
import ProductDetails from "../infor-ticket/page";
import PaymentInvoiceForm from "../infor-payment/page";
import { useSearchParams } from 'next/navigation';
import Statistics from "../dashboard/page";
import "./create-event.css";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'
const LeftSide = dynamic(() => import('@/components/LeftSide-Admin'), { ssr: false })
const TopSize = dynamic(() => import('@/components/topSize-Admin.jsx'), { ssr: false })
import EventDetails from "./EventDetails";
import Swal from "sweetalert2";

const EventForm = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("event-info");
  const [suKien, setSuKien] = useState<SuKien | null>(null);
  const [openDetail , setopenDetail] = useState(false);

  const searchParams = useSearchParams();
  const IDFromURL = searchParams.get('id');

  
  useEffect(() => {
    const IDFromLocal = localStorage.getItem("IDSuKien");
  
    const finalID = IDFromURL || IDFromLocal;
  
    if (finalID) {
      const fetchSuKien = async () => {
        try {
          const data = await suKienService.getSuKienChiTiet(finalID);
          console.log(data);
          setSuKien(data);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
        }
      };
      fetchSuKien();
    }
  }, [searchParams]);
  



  const handleDuyetOrHuySuKien = (trangThai: "Đã xác nhận" | "Hủy") => {
    const IDFromURL = searchParams.get('id');
    const IDFromLocal = localStorage.getItem("IDSuKien");
    const finalID = IDFromURL || IDFromLocal;
  
    if (finalID) {
      const updateSuKien = async () => {
        try {
          await suKienService.DuyetSuKien(finalID, trangThai);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: trangThai === "Đã xác nhận" ? "Đã duyệt thành công sự kiện" : "Đã Hủy sự kiện",
            timer: 2000,
            showConfirmButton: false,
          });
          router.push("/Admin/OrderEvent/");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Không thể ${trangThai === "Đã xác nhận" ? "duyệt" : "Hủy"} sự kiện. ${error}`,
            timer: 2000,
            showConfirmButton: false,
          });
        }
      };
      updateSuKien();
    }
  };
  
  

  const tab = [
    { id: "event-info", label: "Thông tin sự kiện", icon: "bi-1-circle-fill" },
    { id: "ticket-time", label: "Thời gian & Loại vé", icon: "bi-2-circle-fill" },
    { id: "payment", label: "Thông tin thanh toán", icon: "bi-3-circle-fill" },
    { id: "dashboard",label: "Thống kê", icon: "bi-4-circle-fill" }
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
      <LeftSide />
      <div id="right" className="overflow-auto" style={{ backgroundColor: "#F5F7FD" }}>
        <TopSize title={suKien?.TenSuKien} />
        <div className="containe">
          <ul className="nav bg-black nav-tabs nav-line d-flex nav-color-secondary justify-content-between p-0 align-items-center"
            style={{ fontSize: "15px", borderBottom: "0.5px solid rgb(93 93 94)" }} role="tablist">
            {tab.map((tab) => (
              <li className="nav-item submenu" role="presentation" key={tab.id}>
                <button
                  className={`p-3 d-flex text-white align-items-center justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
                    activeTab === tab.id ? "active" : ""}`}
                  style={{ width: "300px" }} onClick={() => setActiveTab(tab.id)}>
                  <i className={`bi ${tab.icon}`}></i> {tab.label}
                </button>
              </li>
            ))}
              {!IDFromURL && (
                  <>
                    <button className=" text btn btn-success me-2"
                      onClick={() => handleDuyetOrHuySuKien("Đã xác nhận")}
                      style={{ backgroundColor: "#2DC275" }}>
                      Duyệt sự kiện
                    </button>
                    <button className=" text btn btn-success me-2"
                      onClick={() => handleDuyetOrHuySuKien("Hủy")}
                      style={{ backgroundColor: "#2DC275" }}>
                      Huỷ sự kiện
                    </button>
                  </>
                )}
          </ul>
          <div className="container-fluid container text-white min-vh-100 p-5">
            {activeTab === "event-info" && suKien && (
              <div className="d-flex flex-column gap-4">
                <div className="p-3 rounded-3" style={{ backgroundColor: "#23252C" }}>
                  <div className="mt-1 d-flex justify-content-between">
                    <div className="d-flex flex-column align-items-center"> 
                      <h5>Logo sự kiện</h5>
                      <img src={suKien.Logo} width="350" height="450" alt="Logo sự kiện" className="rounded-3"/>
                    </div>
                    <div className="d-flex flex-column align-items-center"> 
                      <h5>Ảnh nền sự kiện</h5>
                      <img src={suKien.AnhNen} width="900" height="450" alt="Ảnh nền sự kiện" className="rounded-3"/>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ backgroundColor:  "#23252C" }}>
                  <div>
                    <label className="text-white border-0 pb-2">Tên sự kiện</label>
                    <input
                      type="text"
                      className="ps-3 form-control input-full w-100"
                      placeholder="Tên sự kiện"
                      value={suKien.TenSuKien}
                      readOnly
                    />
                  </div>
                  <div className="mt-4">
                    <label className="text-white border-0 pb-2">Địa điểm tổ chức</label>
                    <input
                      type="text"
                      className="ps-3 form-control input-full w-100"
                      placeholder="Địa điểm tổ chức"
                      value={suKien.DiaDiem}
                      readOnly
                    />
                  </div>
                  <div className="mt-4">
                    <label className="text-white border-0 pb-2">Thể loại sự kiện</label>
                    <input
                      type="text"
                      className="ps-3 form-control input-full w-100"
                      placeholder="Địa điểm tổ chức"
                      value={suKien.TenLoaiSuKien}
                      readOnly
                    />
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ backgroundColor: "#23252C" }}>
                  <label className="text-white border-0 pb-2">Thông tin sự kiện</label>
                  <div className={`event-details ${openDetail ? 'expanded' : ''}`}>
                    <EventDetails htmlContent={suKien.ThongTinSuKien}/>
                  </div>
                  <div className="View-Details d-flex align-items-center gap-2 justify-content-center p-2 mt-3 border-0 w-100" style={{cursor : "pointer"}}
                    onClick={() => setopenDetail(!openDetail)}>
                    <i className={`bi ${openDetail ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    <span>{openDetail? 'Đóng chi tiết' : 'Xem chi tiết'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-3 d-flex gap-4" style={{ backgroundColor: "#23252C" }}>
                  <div className="d-flex flex-column align-items-center">
                    <h5>Logo ban tổ chức</h5>
                    <img src={suKien.LogoBanToChuc} width={275} height={265} className="rounded-3"/>  
                  </div>
                  <div className="col-md-9">
                    <div className="mb-4">
                      <label className="text-white border-0 pb-2">Tên ban tổ chức</label>
                      <input
                        type="text"
                        className="form-control input-full w-100 ps-3"
                        placeholder="Tên ban tổ chức"
                        value={suKien.TenBanToChuc}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-white border-0 pb-2">Thông tin ban tổ chức</label>
                      <textarea
                        className="form-control input-full w-100 p-2 ps-3"
                        placeholder="Thông tin ban tổ chức"
                        value={suKien.ThongTinBanToChuc}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

                        
            {activeTab == "ticket-time" && (
              <ProductDetails />
            )}

             {activeTab == "payment" && (
               <PaymentInvoiceForm />
            )}

            {activeTab == "dashboard" && (
               <Statistics />
            )}


          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;
