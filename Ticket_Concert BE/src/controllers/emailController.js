import transporter from "../config/email.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendEmails = async (req, res) => {
  const { emails, subject, content, startDate, endDate } = req.body;

  if (!emails || !subject || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #f5f5f5; padding: 10px; text-align: center; }
        .content { padding: 20px; }
        .footer { font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${subject}</h2>
        </div>
        <div class="content">
          <p><strong>Suất diễn:</strong> ${startDate} - ${endDate}</p>
          <p>${content}</p>
        </div>
        <div class="footer">
          <p>Email được gửi từ hệ thống của chúng tôi. Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    for (const [email] of emails.entries()) {
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
    res
      .status(500)
      .json({ error: "Lỗi khi gửi email", details: error.message });
  }
};

export default sendEmails;
