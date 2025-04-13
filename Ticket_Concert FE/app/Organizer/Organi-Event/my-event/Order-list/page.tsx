"use client";
import { useState } from "react";
import LeftSidebar from "../component/menu";
import TopSidebar from "@/components/topSide-Organizer";
import dynamic from "next/dynamic";
import "../../../style/Home.css"

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

export interface Order {
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  ticketType: string;
  price: string;
  total: string;
}

export interface Ticket extends Order {
  status: string;
}

export default function OrdersAndTickets() {
  const [activeTab, setActiveTab] = useState<"Đơn hàng" | "Vé">("Đơn hàng");
  const [startDate, setStartDate] = useState<string>("2025-03-01");
  const [endDate, setEndDate] = useState<string>("2025-03-21");
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]); 

  const ordersData: Order[] = [
    {
      name: "Nguyễn Văn A",
      email: "lyvanminh280504@gmail.com",
      phone: "0909123456",
      paymentMethod: "Chuyển khoản",
      ticketType: "VIP",
      price: "1.000.000đ",
      total: "2.000.000đ",
    },
  ];

  const ticketsData: Ticket[] = [
    {
      name: "Trần Thị B",
      email: "lhieu0357@gmail.com",
      phone: "0911222333",
      paymentMethod: "Momo",
      ticketType: "Thường",
      price: "500.000đ",
      total: "1.000.000đ",
      status: "Đã thanh toán",
    },
    {
      name: "Lê Văn C",
      email: "c@gmail.com",
      phone: "0922333444",
      paymentMethod: "Tiền mặt",
      ticketType: "VIP",
      price: "1.000.000đ",
      total: "1.000.000đ",
      status: "Chưa thanh toán",
    },
  ];
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allEmails = ordersData.map((order) => order.email);
      setSelectedOrders(allEmails);
      console.log("All selected emails:", allEmails);
    } else {
      setSelectedOrders([]);
    }
  };

  // Hàm xử lý chọn từng checkbox
  const handleSelectTicket = (email: string) => {
    setSelectedOrders((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Hàm gửi email cho tất cả (tab Đơn hàng)
  const handleSendAllEmails = async () => {
    if (!emailSubject || !emailContent) {
      alert("Vui lòng nhập tiêu đề và nội dung email!");
      return;
    }

    const emailList = ordersData.map((order) => order.email);
    console.log("Danh sách email đã chọn (tất cả):", emailList);
    await sendEmails(emailList);
  };

  // Hàm gửi email cho các mục đã chọn (tab Đơn hàng)
  const handleSendSelectedEmails = async () => {
    if (!emailSubject || !emailContent) {
      alert("Vui lòng nhập tiêu đề và nội dung email!");
      return;
    }

    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một người nhận!");
      return;
    }

    console.log("Danh sách email đã chọn:", selectedOrders);
    console.log("Nội dung email:", emailContent);
    await sendEmails(selectedOrders);
  };

  // Hàm chung để gửi email
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
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        alert("Emails đã được gửi thành công!");
        setShowEmailModal(false);
        setEmailSubject("");
        setEmailContent("");
        setSelectedOrders([]);
      } else {
        const errorData = await response.json();
        alert(`Có lỗi xảy ra khi gửi emails: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("Có lỗi xảy ra khi gửi emails");
    }
  };

  return (
    <div className="d-flex">
      <LeftSidebar />
      <div id="right" className="overflow-auto w-100">
        <TopSidebar title="Sự kiện của tôi" />
        <div className="container">
          <div className="bg-light p-3 pt-4 rounded">
            {/* Phần chọn thời gian */}
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="mb-0">Danh sách buổi biểu diễn</h5>
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control border"
                      style={{ width: "150px" }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-control border"
                      style={{ width: "150px" }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="row mb-3">
              <div className="d-flex rounded mb-3">
                <button
                  className={`w-50 rounded-0 border rounded-start btn ${
                    activeTab === "Đơn hàng" ? "btn-success" : "btn"
                  }`}
                  onClick={() => setActiveTab("Đơn hàng")}
                >
                  Đơn hàng
                </button>
                <button
                  className={`w-50 rounded-0 border rounded-end btn ${
                    activeTab === "Vé" ? "btn-success" : "btn"
                  }`}
                  onClick={() => setActiveTab("Vé")}
                >
                  Vé
                </button>
              </div>
              <div className="col-md-12 d-flex gap-2">
                <div className="ms-auto d-flex gap-2">
                  {activeTab === "Đơn hàng" && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => setShowEmailModal(true)}
                      >
                        Gửi tất cả email
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowEmailModal(true)}
                      >
                        Email đã chọn
                      </button>
                    </>
                  )}
                  {activeTab === "Vé" && (
                    <>
                      <button className="btn btn-success">Xuất báo cáo</button>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Popup */}
              {showEmailModal && (
                <div
                  className="modal fade show d-block"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  onClick={() => setShowEmailModal(false)}
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: "1000px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          <img src="/logo.png" width={50} height={50} className="me-2" alt="Logo" />
                          Gửi Email Suất Diễn
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowEmailModal(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">
                            Suất diễn: {startDate} - {endDate}
                          </label>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="emailSubject" className="form-label">
                            Tiêu đề email
                          </label>
                          <input
                            type="text"
                            className="form-control border"
                            id="emailSubject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="emailContent" className="form-label">
                            Nội dung email
                          </label>
                          <Editor
                            value={emailContent}
                            onEditorChange={(content) => setEmailContent(content)} // Sửa onChange thành onEditorChange
                            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                            init={{
                              height: 300,
                              content_style: "body { font-size: 14px; }",
                              menubar: true,
                              plugins: "lists link image table",
                              toolbar:
                                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
                            }}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowEmailModal(false)}
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={
                            activeTab === "Đơn hàng" && selectedOrders.length === 0
                              ? handleSendAllEmails
                              : handleSendSelectedEmails
                          }
                        >
                          Gửi đi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bảng dữ liệu */}
            <div className="row">
              <div className="col-md-12">
                {activeTab === "Đơn hàng" && (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              selectedOrders.length === ordersData.length &&
                              ordersData.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Hình thức thanh toán</th>
                        <th>Loại vé</th>
                        <th>Giá</th>
                        <th>Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center">
                            <img src="https://via.placeholder.com/50?text=No+Data" alt="No data" className="mb-2"/>
                            <p>No data</p>
                          </td>
                        </tr>
                      ) : (
                        ordersData.map((order, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.email)}
                                onChange={() => handleSelectTicket(order.email)}
                              />
                            </td>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.ticketType}</td>
                            <td>{order.price}</td>
                            <td>{order.total}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === "Vé" && (
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Hình thức thanh toán</th>
                        <th>Loại vé</th>
                        <th>Giá</th>
                        <th>Số tiền</th>
                        <th>Trạng thái thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketsData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center">
                            <img src="https://via.placeholder.com/50?text=No+Data" alt="No data" className="mb-2"/>
                            <p>No data</p>
                          </td>
                        </tr>
                      ) : (
                        ticketsData.map((ticket, index) => (
                          <tr key={index}>
                            <td>{ticket.name}</td>
                            <td>{ticket.email}</td>
                            <td>{ticket.phone}</td>
                            <td>{ticket.paymentMethod}</td>
                            <td>{ticket.ticketType}</td>
                            <td>{ticket.price}</td>
                            <td>{ticket.total}</td>
                            <td>{ticket.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}