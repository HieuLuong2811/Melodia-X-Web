"use client";
import React, { useState, useEffect } from "react";
import Ticket from "../../Create-Event/infor-ticket/page.tsx";
import Messcustor from "../mess-custor/page.tsx";
import "../../style/Home.css";
import Payment from "../../Create-Event/infor-payment/page.tsx";
import { LoaisuKienService } from "@/services/LoaiSuKien";
import { LoaiSuKien } from "@/interfaces/LoaiSuKien";
import Swal from "sweetalert2";
import { suKienService } from "@/services/SuKien.ts";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import TopSidebar from "@/app/Organizer/component/topSide-Organizer.tsx";
const WelcomeDialog = dynamic(() => import("../welcome/WelcomeDialog.tsx"), { ssr: false });
const LeftSidebar = dynamic(() => import("../../component/LeftSide-Organizer.tsx"), { ssr: false });
const CKEditor = dynamic(() => import('@/components/CKEditorClientOnly.tsx'), {
  ssr: false,
});
import dynamic from "next/dynamic";
import "./create-event.css";

const MediaUploader = dynamic(() => import("@/components/ImageUploader.tsx"), {
  ssr: false,
});


const EventForm = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/Authen/Login");
    }
  }, []);

  // Sửa sự kiện ---------------------------------------------------------------------------------------------------
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId");
  const isEditMode = !!eventId;

  useEffect(() => {
    if (isEditMode) {
      const fetchEventData = async () => {
        try {
          const response = await suKienService.getSuKienById(eventId);
          setTenSuKien(response.TenSuKien || "");
          setDiaDiem(response.DiaDiem || "");
          setContent(response.ThongTinSuKien || "");
          SetselectedLoaiSuKien(response.IDLoaiSuKien || "");
          if (response?.Logo) {
            localStorage.setItem("uploadedMedia_logo", response.Logo);
          }
          if (response?.AnhNen) {
            localStorage.setItem("uploadedMedia_background", response.AnhNen);
          }
          if (response?.LogoBanToChuc) {
            localStorage.setItem(
              "uploadedMedia_logoOrganizer",
              response.LogoBanToChuc
            );
          }
          if (response?.Video) {
            localStorage.setItem("uploadedMedia_video", response.Video);
            setVideoVisible(true);
          }
          setTenBanToChuc(response.TenBanToChuc || "");
          setThongTinBanToChuc(response.ThongTinBanToChuc || "");
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);

  // Active tab -----------------------------------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("event-info");
  const tab = [
    { id: "event-info", label: "Thông tin sự kiện", icon: "bi-1-circle-fill" },
    {
      id: "ticket-time",
      label: "Thời gian & Loại vé",
      icon: "bi-2-circle-fill",
    },
    { id: "payment", label: "Thông tin thanh toán", icon: "bi-3-circle-fill" },
    { id: "settings", label: "Cài đặt", icon: "bi-4-circle-fill" },
  ];

  // Tạo sự kiện ----------------------------------------------------------------------------------------------------

  const [logo, setLogo] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [logoOganizer, setLogoOganizer] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);

  const [tenSuKien, setTenSuKien] = useState("");
  const [diaDiem, setDiaDiem] = useState("MY DINH INDOOR ATHLETICS ARENA - Tran Huu Duc, Phường Cầu Diễn, Quận Nam Từ Liêm, Thành Phố Hà Nội");
  const [thongTinSuKien, setContent] = useState("");
  const [tenBanToChuc, setTenBanToChuc] = useState("");
  const [thongTinBanToChuc, setThongTinBanToChuc] = useState("");

  const [videoVisible, setVideoVisible] = useState(false);

  const [LoaiSuKiens, SetLoaiSuKiens] = useState<LoaiSuKien[]>([]);
  const [selectedLoaiSuKien, SetselectedLoaiSuKien] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchLoaiSuKien = async () => {
      const data = await LoaisuKienService.getAllLoaiSuKiens();
      SetLoaiSuKiens(data);
    };

    fetchLoaiSuKien();
  }, []);

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    SetselectedLoaiSuKien(selectedId);
  };

  const UpdateEvent = async (eventId: string) => {
    if (eventId) {
      const eventData = {
        IDLoaiSuKien: selectedLoaiSuKien ?? undefined,
        IDNguoiDung: localStorage.getItem("IDNguoiDung") || "",
        TenSuKien: tenSuKien,
        Logo: logo || localStorage.getItem("uploadedMedia_logo") || "",
        AnhNen:
          background || localStorage.getItem("uploadedMedia_background") || "",
        DiaDiem: diaDiem,
        ThongTinSuKien: thongTinSuKien,
        LogoBanToChuc:
          logoOganizer ||
          localStorage.getItem("uploadedMedia_logoOrganizer") ||
          "",
        TenBanToChuc: tenBanToChuc,
        ThongTinBanToChuc: thongTinBanToChuc,
        Video: video || localStorage.getItem("uploadedMedia_video") || "",
      };
      if (!tenSuKien || !diaDiem || !eventData.IDLoaiSuKien) {
        Swal.fire({
          icon: "warning",
          title: "Bắt buộc!",
          text: "Vui lòng nhập đầy đủ thông tin!",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      } else {
        await suKienService.updateSuKien(eventId, eventData);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã lưu sự kiện thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleContinue = () => {
    const eventData = {
      IDLoaiSuKien: selectedLoaiSuKien,
      IDNguoiDung: localStorage.getItem("IDNguoiDung") || "",
      Logo: logo || localStorage.getItem("uploadedMedia_logo") || "",
      AnhNen:
        background || localStorage.getItem("uploadedMedia_background") || "",
      TenSuKien: tenSuKien,
      DiaDiem: diaDiem,
      ThongTinSuKien: thongTinSuKien,
      TrangThaiSuKien: "Chờ xác nhận",
      LogoBanToChuc:
        logoOganizer ||
        localStorage.getItem("uploadedMedia_logoOrganizer") ||
        "",
      TenBanToChuc: tenBanToChuc,
      ThongTinBanToChuc: thongTinBanToChuc,
      Video: video || localStorage.getItem("uploadedMedia_video") || "",
    };

    if (!tenSuKien || !diaDiem || !eventData.IDLoaiSuKien) {
      Swal.fire({
        icon: "warning",
        title: "Bắt buộc!",
        text: "Vui lòng nhập đầy đủ thông tin!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    } else {
      const danhSachSuKien = [eventData];
      sessionStorage.setItem("danhSachSuKien", JSON.stringify(danhSachSuKien));
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Lưu sự kiện thành công",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    const currentIndex = tab.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tab.length - 1) {
      setActiveTab(tab[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = tab.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tab[currentIndex - 1].id);
    }
  };

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
      <div className="d-flex" style={{ height: "100%" }}>
        <LeftSidebar />
        <div id="right" className="bg-black overflow-auto">
          <TopSidebar title="Thông tin sự kiện" />
          <WelcomeDialog />
          <div className="container p-0 m-0" style={{ height: "100%" }}>
            <div>
              <ul
                className="nav bg-black ps-2 pe-2 nav-tabs nav-line d-flex nav-color-secondary justify-content-between p-0 align-items-center"
                style={{
                  fontSize: "15px",
                  borderBottom: "0.5px solid rgb(93 93 94)",
                }}
                role="tablist"
              >
                <button
                  className="btn btn-success"
                  style={{ display: `${isEditMode ? "none" : "block"}` }}
                  disabled={activeTab === "event-info"}
                  onClick={handleBack}
                >
                  Quay lại
                </button>
                {tab.map((tab) => (
                  <li className="nav-item submenu" role="presentation" key={tab.id}>
                    <button
                      className={`p-2 d-flex align-items-center justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      style={{
                        width: "270px",
                        cursor: `${isEditMode ? "pointer" : "none"}`,
                        fontSize: "14px",
                      }}
                      disabled={!isEditMode}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`bi ${tab.icon}`}></i> {tab.label}
                    </button>
                  </li>
                ))}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    disabled={
                      isEditMode
                        ? activeTab !== "event-info"
                        : activeTab === "settings"
                    }
                    onClick={() => {
                      if (isEditMode) {
                        UpdateEvent(eventId);
                      } else {
                        handleContinue();
                      }
                    }}
                  >
                    {isEditMode ? "Cập nhật" : "Tiếp tục"}
                  </button>
                </div>
              </ul>

              <div
                className="container-fluid text-white min-vh-100 p-5"
                style={{
                  background: "linear-gradient(rgb(19, 36, 27), rgb(37 15 33))",
                }}
              >
                {activeTab === "event-info" && (
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-4">
                      <div
                        className="p-3 rounded-3"
                        style={{ backgroundColor: "#23252C" }}
                      >
                        <label
                          className="text-white border-0 fs-6 pb-2"
                          htmlFor="logo"
                        >
                          Upload hình ảnh và video
                        </label>
                        <div className="mt-1 d-flex justify-content-between">
                          {/* Logo */}
                          <MediaUploader
                            type="logo"
                            mediaType="image"
                            expectedSize={{ width: 720, height: 958 }}
                            onUploadSuccess={setLogo}
                          />
                          {logo && (
                            <img
                              src={logo}
                              alt="Logo sự kiện"
                              style={{ width: "100px", height: "100px" }}
                            />
                          )}

                          {/* Ảnh nền */}
                          <MediaUploader
                            type="background"
                            mediaType="image"
                            expectedSize={{ width: 1280, height: 720 }}
                            onUploadSuccess={setBackground}
                          />
                          {background && (
                            <img
                              src={background}
                              alt="background sự kiện"
                              style={{ width: "100px", height: "100px" }}
                            />
                          )}
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-3 d-flex flex-wrap gap-1 justify-content-between"
                        style={{
                          minHeight: "380px",
                          backgroundColor: "#23252C",
                        }}
                      >
                        {/* Card Video */}
                        <div
                          className="flex-grow-1 p-3 rounded"
                          style={{
                            maxWidth: "49%",
                            backgroundColor: "#2C2F38",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="text-white mb-3">
                              🎥 Video giới thiệu
                            </h5>
                            <div className="form-check form-switch">
                              <label
                                className="form-check-label text-white"
                                htmlFor="videoToggle"
                              >
                                {videoVisible ? "Hiển thị" : "Ẩn"}
                              </label>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="videoToggle"
                                checked={videoVisible}
                                onChange={(e) =>
                                  setVideoVisible(e.target.checked)
                                }
                              />
                            </div>
                          </div>
                          {videoVisible && (
                            <div className="mt-3 d-flex justify-content-center">
                              <MediaUploader
                                type="video"
                                mediaType="video"
                                onUploadSuccess={setVideo}
                              />
                              {video && (
                                <video
                                  src={video}
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-3"
                        style={{ backgroundColor: "#23252C" }}
                      >
                        <div>
                          <label
                            className="text-white border-0 pb-2"
                            htmlFor="logo"
                          >
                            Tên sự kiện
                          </label>
                          <input
                            type="text"
                            className="ps-3 form-control input-full w-100"
                            id="inlineinput"
                            placeholder="Tên sự kiện"
                            value={tenSuKien || ""}
                            onChange={(e) => setTenSuKien(e.target.value)}
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            className="text-white border-0 pb-2"
                            htmlFor="logo"
                          >
                            Địa điểm tổ chức
                          </label>
                          <input
                            type="text"
                            className="ps-3 form-control input-full w-100"
                            id="inlineinput"
                            disabled
                            placeholder="Địa điểm tổ chức"
                            value={diaDiem || "MY DINH INDOOR ATHLETICS ARENA - Tran Huu Duc, Phường Cầu Diễn, Quận Nam Từ Liêm, Thành Phố Hà Nội"}
                            onChange={(e) => setDiaDiem(e.target.value)}
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            className="text-white border-0 pb-2"
                            htmlFor="logo"
                          >
                            Thể loại sự kiện
                          </label>
                          <select
                            className="form-select input-fixed ps-3"
                            id="notify_state"
                            onChange={handleEventTypeChange}
                            value={selectedLoaiSuKien || ""}
                          >
                            <option value="">Chọn thể loại sự kiện</option>
                            {LoaiSuKiens.map((type) => (
                              <option
                                key={type.IDLoaiSuKien}
                                value={type.IDLoaiSuKien || ""}
                              >
                                {type.TenLoai}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-3"
                        style={{ backgroundColor: "#23252C" }}
                      >
                        <div className="">
                          <label
                            className="text-white border-0 pb-2"
                            htmlFor="logoOganizer"
                          >
                            Thông tin sự kiện
                          </label>
                          {isEditMode ? (
                            <CKEditor value={thongTinSuKien} onChange={setContent} />
                          ) : (
                            <CKEditor value={thongTinSuKien} onChange={setContent} />
                          )}
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-3 d-flex gap-4"
                        style={{ backgroundColor: "#23252C" }}
                      >
                        <MediaUploader
                          type="logoOrganizer"
                          mediaType="image"
                          expectedSize={{ width: 275, height: 275 }}
                          onUploadSuccess={setLogoOganizer}
                        />
                        {logoOganizer && (
                          <img
                            src={logoOganizer}
                            alt="logoOganizer sự kiện"
                            style={{ width: "100px", height: "100px" }}
                          />
                        )}
                        <div className="col-md-9">
                          <div className="mb-4">
                            <label
                              className="text-white border-0 pb-2"
                              htmlFor="logo"
                            >
                              Tên ban tổ chức
                            </label>
                            <input
                              type="text"
                              className="form-control input-full w-100 ps-3"
                              id="inlineinput"
                              placeholder="Địa điểm tổ chức"
                              value={tenBanToChuc || ""}
                              onChange={(e) => setTenBanToChuc(e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              className="text-white border-0 pb-2"
                              htmlFor="logo"
                            >
                              Thông tin ban tổ chức
                            </label>
                            <textarea
                              className="form-control input-full w-100 p-2 ps-3"
                              placeholder="Thông tin ban tổ chức"
                              value={thongTinBanToChuc || ""}
                              onChange={(e) =>
                                setThongTinBanToChuc(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ticket-time" && <Ticket />}

                {activeTab === "payment" && <Payment />}

                {activeTab === "settings" && <Messcustor />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;
