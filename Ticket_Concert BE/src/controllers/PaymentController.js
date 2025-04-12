import https from "https";
import crypto from "crypto";
import momoConfig from "../config/momo.js";

export const createMoMoPayment = async (req, res) => {
  try {
    const {
      amount,
      orderInfo = "Thanh toan ve su kien",
      extraData = "",
    } = req.body;

    const requestId = momoConfig.partnerCode + Date.now();
    const orderId = requestId;
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: momoConfig.partnerCode,
      partnerName: "EventBooking",
      storeId: "MomoEventStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: "vi",
      requestType: "payWithMethod",
      autoCapture: true,
      extraData,
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", (chunk) => {
        data += chunk;
      });
      momoRes.on("end", () => {
        const responseData = JSON.parse(data);
        res.json(responseData);
      });
    });

    momoReq.on("error", (e) => {
      console.error("MoMo payment error:", e);
      res.status(500).json({ message: e.message });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (error) {
    console.error("Failed to create MoMo payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Optional: handleMoMoIPN (callback khi thanh toán xong)
export const handleMoMoIPN = async (req, res) => {
  try {
    const {
      orderId,
      requestId,
      resultCode,
      message,
      amount,
      extraData,
    } = req.body;

    if (resultCode === 0) {
      // Thành công: xử lý lưu đơn hàng ở đây nếu cần
      console.log("Thanh toán thành công từ MoMo:", orderId);
    } else {
      console.warn("Thanh toán thất bại hoặc bị huỷ:", message);
    }

    res.status(200).json({ message: "IPN received" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
