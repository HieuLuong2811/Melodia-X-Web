"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SuatDien } from "@/interfaces/SuatDien";
import { SuatDienService } from "@/services/SuatDien";
import {DisplayEventTime} from "@/components/DisplayEventTime";
import { HoaDonMuaService } from "@/services/HoaDonMuaVe";
import { HoaDonMua } from "@/interfaces/HoaDonMuaVe";
import "../../../style/Home.css";
const EmptyData = dynamic(() => import('@/components/emptydata'));import Swal from "sweetalert2";
const LeftSidebar = dynamic(() => import("../component/menu.tsx").then(), { ssr: false });
const TopSidebar = dynamic(() => import("@/app/Organizer/component/topSide-Organizer.tsx").then(), { ssr: false });
const CKEditor = dynamic(() => import('@/components/CKEditorClientOnly.tsx'), {
  ssr: false,
}); 

export default function OrdersAndTickets() {

  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [suatDiens, setSuatDiens] = useState<SuatDien[]>([]);
  const [selectedSuatDienId, setSelectedSuatDienId] = useState<string>("");
  const [selectedSuatDien, setSelectedSuatDien] = useState<SuatDien | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [orders, setOrders] = useState<HoaDonMua[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventId = localStorage.getItem("IDSuKien_Organizer_Detail");
        if (!eventId) {
          return;
        }

        const suatDienData = await SuatDienService.getbyIDSuKien(eventId);
        if (suatDienData) {
          const suatDienArray = Array.isArray(suatDienData) ? suatDienData : [suatDienData];
          setSuatDiens(suatDienArray);

          if (suatDienArray.length > 1) {
            try {
              const ordersData = await HoaDonMuaService.getHoaDonByIDSuatDien(suatDienArray[0].IDSuatDien);
              setOrders(ordersData);
            } catch (error) {
              console.error("Lỗi khi lấy đơn hàng:", error);
              setOrders([]);
            }
          }
          else {
             setSelectedSuatDienId(suatDienArray[0].IDSuatDien);
             const ordersData = await HoaDonMuaService.getHoaDonByIDSuatDien(suatDienArray[0].IDSuatDien);
             setOrders(ordersData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [selectedSuatDienId, selectedSuatDien]);

  // Xử lý thay đổi suất diễn
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    setSelectedSuatDienId(selectedId);
    const found = suatDiens.find((s) => s.IDSuatDien === selectedId);
    setSelectedSuatDien(found ?? null);
  };

  // Xử lý chọn tất cả checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allEmails = orders.map((order) => order.Email);
      setSelectedOrders(allEmails);
    } else {
      setSelectedOrders([]);
    }
  };

  // Xử lý chọn từng checkbox
  const handleSelectTicket = (email: string) => {
    setSelectedOrders((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const EmailShowModel = () => {
    if(selectedOrders.length === 0 ) {
      Swal.fire("Lỗi!", "Hãy chọn một đơn hàng để tiến hành", "warning");
      return;
    }
    else {
      setShowEmailModal(true);
    }
  }


  const handleSendSelectedEmails = async () => {
    if (!emailSubject || !emailContent) {
      Swal.fire("Lỗi!", "Vui lòng nhập tiêu đề và nội dung email!", "warning");
      return;
    }

    if (selectedOrders.length === 0) {
      Swal.fire("Lỗi!", "Vui lòng chọn ít nhất một người nhận!", "warning");
      return;
    }

    setIsSendingEmail(true); 
    await sendEmails(selectedOrders);
    setIsSendingEmail(false); 
  };

  // Hàm gửi email chung
  const sendEmails = async (emailList: string[]) => {
    try {
      const response = await fetch("http://localhost:3000/api/send-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: emailList,
          subject: emailSubject,
          content: emailContent,
          startDate: selectedSuatDien ? new Date(selectedSuatDien.ThoiGianBatDau).toISOString() : "",
          endDate: selectedSuatDien ? new Date(selectedSuatDien.ThoiGianKetThuc).toISOString() : "",
        }),
      });

      if (response.ok) {
        Swal.fire("Thành công", "Emails đã được gửi thành công cho toàn bộ khách hàng", "success");
        setShowEmailModal(false);
        setEmailSubject("");
        setEmailContent("");
        setSelectedOrders([]);
      } else {
        const errorData = await response.json();
        Swal.fire("Lỗi!", `Có lỗi xảy ra khi gửi emails: ${errorData.error || "Unknown error"}`, "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!" , `Có lỗi xảy ra khi gửi emails + ${error}`, "error",);
    }
  };

  const renderOrdersTable = () => (
    <div>
      {orders.length === 0 ? (
        <div className="sc-ffc90067-7 sc-cd78c11b-1 fFJbAL ePwTxf  flex-column  text-center w-100 d-flex justify-content-center">
          <EmptyData />
          <div className="text-dark fs-5 fw-bold mt-3">Chưa có đơn hàng</div>
        </div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Hình thức thanh toán</th>
              <th>Tổng vé</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.Email)}
                    onChange={() => handleSelectTicket(order.Email)}
                  />
                </td>
                <td>{order.TenNguoiDung}</td>
                <td>{order.Email}</td>
                <td>{order.SoDienThoai}</td>
                <td>{order.PhuongThucThanhToan}</td>
                <td>{order.TongSoVeMua}</td>
                <td>{order.TongTienThanhToan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render modal gửi email
  const renderEmailModal = () => (
    <div className="modal text-dark fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShowEmailModal(false)}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "1000px" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <img src="/logo.png" width={50} height={50} className="me-2" alt="Logo" />
              Gửi Email Suất Diễn
            </h5>
            <button type="button" className="btn-close" onClick={() => setShowEmailModal(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">
                Suất diễn:{" "}
                {selectedSuatDien ? (
                  <DisplayEventTime
                    start={selectedSuatDien.ThoiGianBatDau}
                    end={selectedSuatDien.ThoiGianKetThuc}/>
                ) : (
                  "Chưa chọn suất diễn"
                )}
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="emailSubject" className="form-label">
                Tiêu đề email
              </label>
              <div className="input-group">
                <input type="text" className="border rounded w-100 p-2" id="emailSubject" value={emailSubject} placeholder="Tiêu đề email"
                  onChange={(e) => setEmailSubject(e.target.value)}/>
              </div>

            </div>
            <div className="mb-3">
              <label htmlFor="emailContent" className="form-label">
                Nội dung email
              </label>
              <CKEditor value={emailContent} onChange={setEmailContent}/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSendSelectedEmails}
              disabled={isSendingEmail} >
              {isSendingEmail ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang gửi...
                </>
              ) : (
                "Gửi đi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      <LeftSidebar />
      <div id="right" className="overflow-auto w-100" style={{ background: "linear-gradient(rgb(15, 46, 29), rgb(30 10 30))" }}>
        <TopSidebar title="Sự kiện của tôi" />
        <div className="container mt-4">
          <div className="bg-light p-3 pt-4 rounded">

            <div className="row mb-4 text-dark">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="mb-0 fw-bold">Danh sách buổi biểu diễn</h5>
                  <div className="d-flex gap-2">
                    <Select id="suatDienSelect"  sx={{ color: 'black', width : "300px", border: '1px solid white', borderRadius: '5px',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                    }} value={selectedSuatDienId} onChange={handleSelectChange}>
                      {suatDiens.map((suatDien) => (
                        <MenuItem key={suatDien.IDSuatDien} value={suatDien.IDSuatDien}>
                          <DisplayEventTime
                            start={suatDien.ThoiGianBatDau}
                            end={suatDien.ThoiGianKetThuc}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex gap-2">
                <div className="ms-auto d-flex gap-2">
                 <button className="btn btn-success" onClick={() => EmailShowModel()}>
                    Gửi tất cả email
                  </button>
                </div>
              </div>
              {showEmailModal && renderEmailModal()}
            </div>

            <div className="row">
              <div className="col-md-12">
                {renderOrdersTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}