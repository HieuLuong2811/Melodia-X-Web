import transporter from "../config/email.js";
import QRCode from "qrcode";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendEmails = async (req, res) => {
  const { emails, subject, content, startDate, endDate } = req.body;

  if (!emails || !subject || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Thông báo sự kiện</title>
    <style>
      body {
        font-family: 'Montserrat', 'Arial', sans-serif;
        background-color: #121212;
        color: #f1f1f1;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #1e1e1e;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.1);
      }
      .header {
        background-color: #2DC275;
        padding: 20px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .header img {
        width: 30%;
        margin-bottom: 0;
      }
      .header h2 {
        margin: 0;
        text-align: center;
        width:70%;
        font-size: 24px;
      }
      .show {
        padding: 24px;
        display: flex;
        align-items: center;
      }
      .show p {
        font-size: 16px;
        margin: 0;
      }
      
      .content {
        background-color: #2a2a2a;
        padding: 16px;
        margin: 12px 20px;
        border-radius: 5px;
      }
      .event-info {
        
        margin-top: 12px;
      }
      .footer {
        background-color: #181818;
        color: #888;
        text-align: center;
        font-size: 12px;
        padding: 16px;
      }
      .logo {
        width: 100px;
        margin: 0 auto 10px;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Bạn có thể thay src bằng logo thật -->
        <img src="https://res.cloudinary.com/desqamcqs/image/upload/v1749979072/dugj4x00uabtatxpzta5.png" alt="Logo" class="logo" />
        <h2>${subject}</h2>
      </div>
      <div class="show">
        <p>⏰ Thời gian suất diễn sự kiện:</p>
        <p>${startDate} - ${endDate}</p>
      </div>
      <div>
        <p class="content">${content}</p>
      </div>
      <div class="footer">
        <p>Đây là email tự động từ hệ thống quản lý sự kiện âm nhạc của chúng tôi.</p>
        <p>Vui lòng không trả lời email này.</p>
      </div>
    </div>
  </body>
  </html>
`;

  try {
    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlTemplate,
      });

      await delay(3000); 
    }

    res.status(200).json({ message: "Emails được gửi thành công" });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).json({ error: "Lỗi khi gửi email", details: error.message });
  }
};

const payticketpass = async (req, res) => {
  const { email, tenNguoiDung, ticketDetails, tenSuKien, startDate, endDate, maHoaDon, totalAmount } = req.body;

  if (!email || !tenNguoiDung || !ticketDetails || !tenSuKien || !startDate || !endDate || !maHoaDon || !totalAmount) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  try {

    const qrCodeImageBase64 = await QRCode.toDataURL(maHoaDon);

    const htmlTemplate = `
     <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Thông báo thanh toán thành công</title>
      <style>
        body {
          font-family: 'Montserrat', 'Arial', sans-serif;
          background-color: #121212;
          color: #f1f1f1;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 255, 135, 0.15);
        }
        .header {
          background-color: #2DC275;
          padding: 20px;
          text-align: center;
          color: #fff;
        }
        .header img {
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .sub-title {
          font-size: 18px;
          margin-top: 8px;
          font-weight: normal;
        }
        .content {
          padding: 20px;
          background-color: #2a2a2a;
        }
        .content p {
          margin: 12px 0;
        }
        .info-box {
          background-color: #333;
          padding: 12px 16px;
          margin: 12px 0;
          border-radius: 6px;
          border-left: 4px solid #2DC275;
        }
        .info-box strong {
          color: #2DC275;
        }
        .ticket-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        .ticket-table th, .ticket-table td {
          border: 1px solid #444;
          padding: 10px;
          text-align: center;
        }
        .ticket-table th {
          background-color: #333;
          color: #2DC275;
        }
        .ticket-table tfoot td {
          font-weight: bold;
          text-align: right;
          padding: 10px;
          color: #f1f1f1;
        }
        .qr-code {
          text-align: center;
          margin-top: 20px;
        }
        .qr-code img {
          width: 150px;
          height: 150px;
        }
        .footer {
          background-color: #181818;
          color: #aaa;
          text-align: center;
          font-size: 12px;
          padding: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://img.icons8.com/external-flat-icons-inmotus-design/67/ffffff/external-ticket-music-and-movies-flat-icons-inmotus-design.png" alt="Ticket Logo" />
          <h1>Thông báo</h1>
          <div class="sub-title">Thanh toán vé thành công</div>
        </div>
        <div class="content">
          <p>Xin chào bạn ${tenNguoiDung},</p>
          <p>Cảm ơn bạn đã mua vé tham dự sự kiện <strong>${tenSuKien}</strong>.</p>
          <div class="info-box">
            <p><strong>Mã hoá đơn:</strong> ${maHoaDon}</p>
            <p><strong>Suất diễn:</strong> ${startDate} - ${endDate}</p>
          </div>

          <table class="ticket-table">
            <thead>
              <tr>
                <th>Mã vé</th>
                <th>Tên vé</th>
                <th>Số lượng</th>
                <th>Giá tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              ${ticketDetails.map(ticket => `
                <tr>
                  <td>${ticket.maVe}</td>
                  <td>${ticket.tenVe}</td>
                  <td>${ticket.soLuong}</td>
                  <td>${ticket.giaTien.toLocaleString()}</td>
                </tr>`).join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Tổng tiền</td>
                <td>${totalAmount.toLocaleString()} VNĐ</td>
              </tr>
            </tfoot>
          </table>

          <div class="qr-code">
            <p>Quét mã QR dưới đây khi đến cổng check-in:</p>
            <img src="${qrCodeImageBase64}" alt="QR Code vé" />
          </div>

          <p>Vui lòng lưu lại email này để kiểm tra hoặc đối chiếu khi tham gia sự kiện.</p>
          <p>Hẹn gặp lại bạn trong không gian âm nhạc bùng cháy và trọn vẹn cảm xúc! 🎶🔥</p>
        </div>
        <div class="footer">
          <p>Đây là email tự động từ hệ thống quản lý sự kiện.</p>
          <p>Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>`; 

    console.log("QR Base64:", qrCodeImageBase64);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Xác nhận thanh toán - ${tenSuKien}`,
      html: htmlTemplate,
    });

    res.status(200).json({ message: "Email xác nhận đã được gửi thành công" });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).json({ error: "Gửi email thất bại", details: error.message });
  }
};

export { sendEmails, payticketpass };