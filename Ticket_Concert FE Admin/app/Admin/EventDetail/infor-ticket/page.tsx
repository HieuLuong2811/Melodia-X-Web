"use client";
import React, { useState, useEffect } from "react";
import DisplayEventTime from "@/components/DisplayEventTime";
import { suKienService } from "@/services/SuKien";
import { useCollapse } from "react-collapsed";
import { SuKienDetails, SuatDien, LoaiVe } from "@/interfaces/SuKien";
import EmptyData from "@/components/Emptydata";
import { useSearchParams } from "next/navigation";

const ShowtimeItem = ({ suat }: { suat: SuatDien }) => {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const handleToggleCollapse = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div key={suat.IDSuatDien} className="SuatDien w-100">
      <div {...getToggleProps({ onClick: handleToggleCollapse })}
        className="ticket rounded justify-content-between w-100 d-flex text-black p-2 ps-3 text-white pe-3 align-items-center gap-3">
        <div className="icon">
          <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
        </div>
        <div className="w-100">
          <div className="d-flex align-items-center fw-bold gap-2">
            <DisplayEventTime start={suat.ThoiGianBatDau} end={suat.ThoiGianKetThuc}/>
          </div>
          <p className="mb-0">{suat.loaiVes.length} loại vé</p>
        </div>
        <span className="fs-4">⋮</span>
      </div>
      <section {...getCollapseProps()} className="w-100 mt-2">
        <div className="ticket-time rounded-1 w-100 text-white">
          {suat.loaiVes.length > 0 ? (
            suat.loaiVes.map((ve: LoaiVe, index: number) => (
              <div key={ve.IDLoaiVe} className="ticket-item  d-flex   rounded-2 justify-content-between align-items-center w-100 px-3 py-3"
                style={{background: index % 2 === 0 ? "rgb(65, 70, 82)" : "rgb(50, 55, 65)", border: "1px solid rgb(56, 56, 61)",}}>
                <div className="d-flex align-items-center gap-2 flex-wrap text-white">
                  <i className="bi bi-list mt-1 fs-4"></i>
                  <i className="bi bi-ticket-perforated mt-1"></i>
                  <span>
                    <strong>{ve.TenVe}</strong>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <p className={`fw-bold m-0 ${ve.SoLuongVe === 0 ? "text-gray" : "text-white"}`}>
                    {parseInt(ve.GiaVe).toLocaleString("vi-VN")} VND
                  </p>
                  {ve.SoLuongVe === 0 && (
                    <p className="m-0 px-2 py-1 rounded bg-pink">Hết vé</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 m-0">Chưa có loại vé nào cho suất diễn này.</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Component chính
export default function ProductDetails() {

  const searchParams = useSearchParams();
  const IDFromURL = searchParams.get('id');

  const [suKien, setSuKien] = useState<SuKienDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuKien = async () => {
      try {
        if(IDFromURL) {
          const data = await suKienService.getSuKienById(IDFromURL);
          if (data) {
            setSuKien(data);
          } else {
            setError("Không tìm thấy sự kiện.");
          }
          setLoading(false);
          return;
        }
        else {
          const idSuKien = localStorage.getItem("IDSuKien");
          if (!idSuKien) {
            setError("Không tìm thấy ID sự kiện trong localStorage.");
            setLoading(false);
            return;
          }
          const data = await suKienService.getSuKienById(idSuKien);
          if (data) {
            setSuKien(data);
          } else {
            setError("Không tìm thấy sự kiện.");
          }
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin sự kiện.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuKien();
  }, []);

  if (loading) return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
  <p>Đang tải sự kiện...</p>
  <div className="d-flex align-items-center gap-3">
    <div className="loading set_1"></div>
    <div className="loading set_2"></div>
    <div className="loading set_3"></div>
  </div>
</div>;;
  if (error) return <p>{error}</p>;
  if (!suKien) return <p>Không có dữ liệu sự kiện để hiển thị.</p>;

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
      <div style={{ zoom: "0.9" }}>
        <div className="event-info rounded">
          <div className="justify-content-between gap-4 p-0">
            <div className="w-100 d-flex flex-column rounded gap-4">
              <div id="InfoVe" className="ticket-info rounded-3 d-flex flex-column gap-3 text-white bg-dark" style={{fontSize : "17px"}}>
                {suKien.suatDiens.length > 0 ? (
                  suKien.suatDiens.map((suat: SuatDien) => (
                    <ShowtimeItem key={suat.IDSuatDien} suat={suat} />
                  ))
                ) : (
                  <div>
                    <EmptyData />
                    <p className="text-center">Chưa có suất diễn nào cho sự kiện này.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}