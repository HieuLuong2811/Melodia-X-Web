"use client";
import React, { useState, useEffect } from "react";
import Ticket from "../../Create-Event/infor-ticket/page.tsx";
import Messcustor from "../mess-custor/page.tsx";
import Payment from "../../Create-Event/infor-payment/page.tsx";
import { LoaisuKienService } from "@/services/LoaiSuKien";
import { LoaiSuKien } from "@/interfaces/LoaiSuKien";
import Swal from "sweetalert2";
import { suKienService } from "@/services/SuKien.ts";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import "../../style/Home.css";
import "./create-event.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const MediaUploader = dynamic(() => import('@/components/ImageUploader.tsx'), { ssr: false });

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

export const WelcomeDialog = () => {
  const [open, setOpen] = useState(true); 
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-description" >
      <Box sx={{backgroundColor : "#FFF"}}>
        <DialogTitle id="welcome-dialog-title" sx={{fontWeight : "bold"}}>LƯU Ý KHI ĐĂNG TẢI SỰ KIỆN!</DialogTitle>
        <DialogContent>
          <div className="ant-modal-body">
            <div>1. Vui lòng 
              <b> không hiển thị thông tin liên lạc của Ban Tổ Chức</b> (ví dụ: Số điện thoại/ Email/ Website/ Facebook/ Instagram…) 
              <b> trên banner và trong nội dung bài đăng.</b> Chỉ sử dụng duy nhất Hotline Ticketbox - 1900.6408.
              <br />2. Trong trường hợp Ban tổ chức <b>tạo mới hoặc cập nhật sự kiện không đúng theo quy định nêu trên, Ticketbox có quyền từ chối phê duyệt sự kiện.</b>
              <br />3. Ticketbox sẽ liên tục kiểm tra thông tin các sự kiện đang được hiển thị trên nền tảng, 
              <b> nếu phát hiện có sai phạm liên quan đến hình ảnh/ nội dung bài đăng, Ticketbox có quyền gỡ bỏ hoặc từ chối cung cấp dịch vụ đối với các sự kiện này,</b> dựa theo điều khoản 2.9 trong Hợp đồng dịch vụ.
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Box>
    
    </Dialog>
  );
}

const EventForm = () => {

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
          if(response?.Logo) {
            localStorage.setItem("uploadedMedia_logo", response.Logo);
          }
          if(response?.AnhNen) {
            localStorage.setItem("uploadedMedia_background", response.AnhNen);
          }
          if(response?.LogoBanToChuc) {
            localStorage.setItem("uploadedMedia_logoOrganizer", response.LogoBanToChuc);
          }
          if(response?.Video) {
            localStorage.setItem("uploadedMedia_video", response.Video);
            setVideoVisible(true);
          }
           if(response?.AnhSoDoGhe) {
            localStorage.setItem("uploadedMedia_soDoGhe", response.AnhSoDoGhe);
            setSoDoGheVisible(true);
          }
          setTenBanToChuc(response.TenBanToChuc || "");
          setThongTinBanToChuc(response.ThongTinBanToChuc || "")
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
    { id: "ticket-time", label: "Thời gian & Loại vé", icon: "bi-2-circle-fill" },
    { id: "payment", label: "Thông tin thanh toán", icon: "bi-3-circle-fill" },
    { id: "settings", label: "Cài đặt", icon: "bi-4-circle-fill" },
  ];


  // Tạo sự kiện ----------------------------------------------------------------------------------------------------

  const [logo, setLogo] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [logoOganizer, setLogoOganizer] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null); 
  const [soDoGhe, setSoDoGhe] = useState<string | null>(null);

  const [tenSuKien, setTenSuKien] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [thongTinSuKien, setContent] = useState("");
  const [tenBanToChuc, setTenBanToChuc] = useState("");
  const [thongTinBanToChuc, setThongTinBanToChuc] = useState("");

  const [videoVisible, setVideoVisible] = useState(false);
  const [soDoGheVisible, setSoDoGheVisible] = useState(false);

  const [LoaiSuKiens, SetLoaiSuKiens] = useState<LoaiSuKien[]>([]);
  const [selectedLoaiSuKien, SetselectedLoaiSuKien] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoaiSuKien = async () => {
      const data = await LoaisuKienService.getAllLoaiSuKiens();
      SetLoaiSuKiens(data);
    };

    fetchLoaiSuKien();
  }, []);

  const handleEventTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    SetselectedLoaiSuKien(selectedId);
  };

  const UpdateEvent = async (eventId : string) => {
    if(eventId){
      const eventData = {
        IDLoaiSuKien: selectedLoaiSuKien ?? undefined,
        IDNguoiDung: localStorage.getItem("IDNguoiDung") || "",
        TenSuKien: tenSuKien,
        Logo: logo || localStorage.getItem("uploadedMedia_logo") || "", 
        AnhNen: background || localStorage.getItem("uploadedMedia_background") || "",  
        DiaDiem: diaDiem,
        ThongTinSuKien: thongTinSuKien,
        LogoBanToChuc: logoOganizer || localStorage.getItem("uploadedMedia_logoOrganizer") || "",
        TenBanToChuc: tenBanToChuc,
        ThongTinBanToChuc: thongTinBanToChuc,
        Video: video || localStorage.getItem("uploadedMedia_video") || "", 
        AnhSoDoGhe: localStorage.getItem("uploadedMedia_soDoGhe") || ""
      }
      if (!tenSuKien || !diaDiem || !eventData.IDLoaiSuKien) {
        Swal.fire({
          icon: "warning",
          title: "Bắt buộc!",
          text: "Vui lòng nhập đầy đủ thông tin!",
          timer: 2000,
          showConfirmButton: false,
        });
      return;
    }
      else {
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
  }

  
  const handleContinue = () => {
    const eventData = {
      IDLoaiSuKien: selectedLoaiSuKien,
      IDNguoiDung: localStorage.getItem("IDNguoiDung") || "",
      Logo: logo || localStorage.getItem("uploadedMedia_logo") || "", 
      AnhNen: background || localStorage.getItem("uploadedMedia_background") || "",  
      TenSuKien: tenSuKien,
      DiaDiem: diaDiem,
      ThongTinSuKien: thongTinSuKien,
      TrangThaiSuKien: "Chờ xác nhận",
      LogoBanToChuc: logoOganizer || localStorage.getItem("uploadedMedia_logoOrganizer") || "",
      TenBanToChuc: tenBanToChuc,
      ThongTinBanToChuc: thongTinBanToChuc,
      Video: video || localStorage.getItem("uploadedMedia_video") || "", 
      AnhSoDoGhe: localStorage.getItem("uploadedMedia_soDoGhe") || ""
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
    }
    else {
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
      <WelcomeDialog />
      <div className="container p-0" style={{width : "100%" , height : "100%"}}>
          <div>
              <ul className="nav bg-black ps-2 pe-2 nav-tabs nav-line d-flex nav-color-secondary justify-content-between p-0 align-items-center"
                style={{ fontSize: "15px", borderBottom: "0.5px solid rgb(93 93 94)" }} role="tablist" >
                <button className="btn btn-success" style={{ display : `${isEditMode ? "none" : "block"}`}} disabled={activeTab === "event-info"} onClick={handleBack} >
                  Quay lại
                </button>
                {tab.map((tab) => (
                    <li className="nav-item submenu" role="presentation" key={tab.id}>
                    <button
                      className={`p-2 d-flex align-items-center justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      style={{ width: "270px", cursor: `${isEditMode ? "pointer" : "none"}`, fontSize: "14px" }} disabled={!isEditMode} onClick={() => setActiveTab(tab.id)}>
                      <i className={`bi ${tab.icon}`}></i> {tab.label}
                    </button>
                  </li>
                ))}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    disabled={isEditMode ? activeTab !== "event-info" : activeTab === "settings"}
                    onClick={() => {
                      if (isEditMode) {
                        UpdateEvent(eventId as string);
                      } else {
                        handleContinue();
                      }
                    }}>
                    {isEditMode ? "Cập nhật" : "Tiếp tục"}
                  </button>
                </div>
              </ul>


            <div className="container-fluid text-white min-vh-100 p-5"
              style={{ background: "linear-gradient(rgb(19, 36, 27), rgb(37 15 33))" }}>
              {activeTab === "event-info" && (
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex flex-column gap-4">
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#23252C" }}>
                        <label className="text-white border-0 fs-6 pb-2" htmlFor="logo">
                          Upload hình ảnh và video
                        </label>
                        <div className="mt-1 d-flex justify-content-between">

                          {/* Logo */}
                          <MediaUploader type="logo" mediaType="image" expectedSize={{ width: 720, height: 958 }} onUploadSuccess={setLogo}/>
                          {logo && ( <img src={logo} alt="Logo sự kiện" style={{ width: "100px", height: "100px" }} />)}

                          {/* Ảnh nền */}
                          <MediaUploader type="background" mediaType="image" expectedSize={{ width: 1280, height: 720 }} onUploadSuccess={setBackground}/>
                          {background && ( <img src={background} alt="background sự kiện" style={{ width: "100px", height: "100px" }}/>)}
                        </div>
                      </div>

                      <div className="p-3 rounded-3 d-flex flex-wrap gap-1 justify-content-between" style={{minHeight : "380px", backgroundColor: "#23252C" }}>
                        {/* Card Video */}
                        <div className="flex-grow-1 p-3 rounded" style={{maxWidth : "49%" ,backgroundColor: "#2C2F38" }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="text-white mb-3">🎥 Video giới thiệu</h5>
                            <div className="form-check form-switch">
                              <label className="form-check-label text-white" htmlFor="videoToggle">
                                {videoVisible ? "Hiển thị" : "Ẩn"}
                              </label>
                               <input className="form-check-input" type="checkbox" id="videoToggle" checked={videoVisible} 
                                onChange={(e) => setVideoVisible(e.target.checked)}/>
                            </div>
                          </div>
                          { videoVisible && (
                            <div className="mt-3 d-flex justify-content-center">
                              <MediaUploader type="video" mediaType="video" onUploadSuccess={setVideo}/>
                              { video && (
                                <video src={video} autoPlay muted loop playsInline/>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Ảnh sơ đồ ghế */}
                        <div className="flex-grow-1 p-3 rounded" style={{maxWidth : "49%", backgroundColor: "#2C2F38" }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="text-white mb-3">🪑 Sơ đồ ghế</h5>
                              <div className="form-check form-switch">
                                <label className="form-check-label text-white" htmlFor="soDoGheToggle">
                                  {soDoGheVisible ? "Hiển thị" : "Ẩn"}
                                </label>
                                <input className="form-check-input" type="checkbox" id="soDoGheToggle" checked={soDoGheVisible} 
                                onChange={(e) => setSoDoGheVisible(e.target.checked)}/>
                              </div>
                          </div>
                          { soDoGheVisible && (
                            <div className="mt-3 d-flex justify-content-center">
                              <MediaUploader type="soDoGhe" mediaType="image" onUploadSuccess={setSoDoGhe}/>
                              { soDoGhe && (
                                <img src={soDoGhe} alt="Sơ đồ ghế sự kiện" style={{ width: "100px", height: "300px", borderRadius: "4px" }}/>
                              )}
                            </div>
                          )}
                        </div>
                      </div>


                      <div className="p-3 rounded-3" style={{ backgroundColor: "#23252C" }}>
                        <div>
                          <label className="text-white border-0 pb-2" htmlFor="logo">
                            Tên sự kiện
                          </label>
                          <input type="text" className="ps-3 form-control input-full w-100" id="inlineinput" placeholder="Tên sự kiện"
                            value={tenSuKien || ""} onChange={(e) => setTenSuKien(e.target.value)}/>
                        </div>
                        <div className="mt-4">
                          <label className="text-white border-0 pb-2" htmlFor="logo">
                            Địa điểm tổ chức
                          </label>
                          <input type="text" className="ps-3 form-control input-full w-100" id="inlineinput" placeholder="Địa điểm tổ chức"
                            value={diaDiem || ""}
                            onChange={(e) => setDiaDiem(e.target.value)} />
                        </div>
                        <div className="mt-4">
                          <label className="text-white border-0 pb-2" htmlFor="logo">
                            Thể loại sự kiện
                          </label>
                          <select className="form-select input-fixed ps-3" id="notify_state" onChange={handleEventTypeChange}
                            value={selectedLoaiSuKien || ""}>
                            <option value="">Chọn thể loại sự kiện</option>
                            {LoaiSuKiens.map((type) => (
                              <option key={type.IDLoaiSuKien} value={type.IDLoaiSuKien || ""}>
                                {type.TenLoai}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="p-3 rounded-3" style={{ backgroundColor: "#23252C" }}>
                        <div className="">
                          <label className="text-white border-0 pb-2" htmlFor="logoOganizer">
                            Thông tin sự kiện
                          </label>
                          {isEditMode ? (
                            <Editor
                              value={thongTinSuKien || ""}
                              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                              init={{
                                height: 400,
                                content_style: "body { font-size: 14px; }",
                                menubar: true,
                                plugins: "lists link image table",
                                toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
                              }}
                              onBlur={(e) => setContent(e.target.getContent())}/>
                          ) : (
                            <Editor
                              value={thongTinSuKien || ""}
                              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                              initialValue={`
                                <p><strong>Giới thiệu sự kiện:</strong></p>
                                <p>[Tóm tắt ngắn gọn về sự kiện: Nội dung chính của sự kiện, điểm đặc sắc nhất và lý do khiến người tham gia không nên bỏ lỡ]</p>
                                <ul>
                                  <li>
                                    <strong>Chương trình chính:</strong> 
                                    [Liệt kê những hoạt động nổi bật trong sự kiện: các phần trình diễn, khách mời đặc biệt, lịch trình các tiết mục cụ thể nếu có.]
                                  </li>
                                  <li>
                                    <strong>Khách mời:</strong> [Thông tin về các khách mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. Có thể bao gồm phần mô tả ngắn gọn về họ và những gì họ sẽ mang lại cho sự kiện.]
                                  </li>
                                  <li>
                                    <strong>Trải nghiệm đặc biệt:</strong> 
                                    [Nếu có các hoạt động đặc biệt khác như workshop, khu trải nghiệm, photo booth, khu vực check-in hay các phần quà/ưu đãi dành riêng cho người tham dự.]
                                  </li>
                                </ul>
                                <p><strong>Điều khoản và điều kiện:</strong></p>
                                <p>[TnC] sự kiện</p>
                                <p>Lưu ý về điều khoản trẻ em</p>
                                <p>Lưu ý về điều khoản VAT</p>
                              `}
                              init={{
                                height: 400,
                                content_style: "body { font-size: 14px; }",
                                menubar: true,
                                plugins: "lists link image table",
                                toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
                              }}
                              onBlur={(e) => setContent(e.target.getContent())}/>
                          )}
                        </div>
                      </div>

                      <div className="p-3 rounded-3 d-flex gap-4" style={{ backgroundColor: "#23252C" }}>
                        <MediaUploader type="logoOrganizer" mediaType="image" expectedSize={{ width: 275, height: 275 }}
                          onUploadSuccess={setLogoOganizer}/>
                        {logoOganizer && (
                          <img src={logoOganizer} alt="logoOganizer sự kiện" style={{ width: "100px", height: "100px" }}/>
                        )}
                        <div className="col-md-9">
                          <div className="mb-4">
                            <label className="text-white border-0 pb-2" htmlFor="logo">
                              Tên ban tổ chức
                            </label>
                            <input type="text" className="form-control input-full w-100 ps-3" id="inlineinput" placeholder="Địa điểm tổ chức" value={tenBanToChuc || ""}
                              onChange={(e) => setTenBanToChuc(e.target.value)}/>
                          </div>
                          <div>
                            <label className="text-white border-0 pb-2" htmlFor="logo">
                              Thông tin ban tổ chức
                            </label>
                            <textarea
                              className="form-control input-full w-100 p-2 ps-3"
                              placeholder="Thông tin ban tổ chức"
                              value={thongTinBanToChuc || ""}
                              onChange={(e) => setThongTinBanToChuc(e.target.value)}
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
    </>
  );
};

export default EventForm;