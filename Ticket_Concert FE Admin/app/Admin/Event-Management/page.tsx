'use client';
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
const LeftSide = dynamic(() => import('@/components/LeftSide-Admin'), { ssr: false })
const TopSize = dynamic(() => import('@/components/topSize-Admin.jsx'), { ssr: false })
import { suKienService } from "@/services/SuKien"; 
import { SuKien } from "@/interfaces/SuKien"; 
import { Tabs, Tab, TextField, FormControl,Button  } from '@mui/material';
import { useRouter } from 'next/navigation';
import "./type.css";
import LoaiSuKienManager from "./Event-Type/page"
import InfoIcon from '@mui/icons-material/Info';

const OrderManagement = () => {
  const [sukiens, setsukien] = useState<SuKien[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');
  const router = useRouter(); 
  const [openModal,setOpenModal] = useState(false);

  const statusOptions: SuKien["TrangThaiSuKien"][] = [
    "Tất cả",
    "Đã xác nhận",
    "Chưa bắt đầu",
    "Đang diễn ra",
    "Hoàn thành",
    "Hủy",
  ];

  useEffect(() => {
    suKienService.getAllEvents().then((data) => setsukien(data)); 
  }, []);

  const filteredSukiens = sukiens.filter(sukien => {
    const tenSuKien = sukien?.TenSuKien?.toLowerCase() || "";
    const diaDiem = sukien?.DiaDiem?.toLowerCase() || "";
    const trangThai = sukien?.TrangThaiSuKien || "";
  
    return (
      tenSuKien.includes(searchName.toLowerCase()) &&
      (activeTab === "Tất cả" || trangThai === activeTab) &&
      diaDiem.includes(searchLocation.toLowerCase())
    );
  });
  

  return (
    <>
      <LeftSide />
      <div id="right" className="overflow-auto" style={{ backgroundColor: "#F5F7FD" }}>
        <TopSize title="Order sự kiện" />
        <div className="container rounded-2 p-3 pt-3 mt-5" style={{minWidth : "1400px"}}>
          <div className="bg-white p-3">
            <div className="d-flex justify-content-between">
                <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto">
                {statusOptions.map((status, index) => (
                  <Tab key={index} label={status} value={status}/>
                ))}
              </Tabs>
              <Button variant="contained" color="primary" startIcon={<InfoIcon />}  onClick={() => setOpenModal(true)}>
                Quản lý loại sự kiện
              </Button>
            </div>
          

            {/* Ô tìm kiếm */}
            <div className="row mt-3">
              <div className="col-md-4">
                <TextField label="Tìm kiếm tên" fullWidth variant="outlined" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
              </div>
              <div className="col-md-4">
                <TextField label="Tìm kiếm địa điểm" fullWidth variant="outlined" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
              </div>
              <div className="col-md-4">
                <TextField label="Tìm kiếm thời gian" fullWidth variant="outlined" type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </div>
            </div>
          </div>
          
          {openModal == true && (
            <div className="overlay">
                  <div className="popup-content">
                    <LoaiSuKienManager onClose={() => setOpenModal(false)}/> 
                  </div>
            </div>
           
          )}
        
          {/* Hiển thị sự kiện sau khi lọc */}
          <div className="row mt-4">
            {filteredSukiens.length > 0 ? (
              filteredSukiens.map((SuKien, index) => (
                <div key={SuKien?.IDSuKien || `sukien-${index}`}  className="col-md-6 mb-4">
                  <div className="rounded-3 shadow-lg p-3 d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      <img src={SuKien.AnhNen || "https://sigmawire.net/i/03/uXfhW2.png"} alt="Logo sự kiện" className="card-img-top rounded-2 w-50" style={{ objectFit: "cover", height: "160px" }} />
                      <div className="d-flex flex-column justify-content-between gap-3 w-50">
                        <h5 className="card-title h-50 pt-2">{SuKien.TenSuKien}</h5>
                      </div>
                    </div>
                    <p className="card-text mb-0" style={{height : "45px", overflow : "hidden"}}>
                      <i className="bi bi-geo-alt-fill"></i> Địa điểm : {SuKien.DiaDiem}
                    </p>
                    <div className="d-flex align-items-center border p-3 gap-2">
                      <img src={SuKien.LogoBanToChuc || "https://sigmawire.net/i/03/uXfhW2.png"} alt="Logo ban tổ chức" className="rounded" width="100" height="100" />
                      <p>{SuKien.TenBanToChuc}</p>
                    </div>
                    <div className="d-flex mt-3 align-items-center justify-content-between">
                      <FormControl className="col-md-8" variant="outlined">
                        <TextField label="Trạng thái sự kiện" fullWidth variant="outlined" value={SuKien.TrangThaiSuKien}/>
                      </FormControl>
                      <Button variant="contained" color="primary" style={{cursor : SuKien.TrangThaiSuKien === "Hủy" ? "none" : "pointer"}} startIcon={<InfoIcon />} onClick={() => {
                          router.push(`/Admin/EventDetail/infor-event/?id=${SuKien.IDSuKien}`);
                          localStorage.setItem("IDNguoiDung-Detail",SuKien.IDNguoiDung)}} disabled={SuKien.TrangThaiSuKien === "Hủy"}>
                          Xem chi tiết
                        </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-12">
                <p className="alert alert-warning">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;
