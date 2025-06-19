import crypto from 'crypto';
import https from 'https';
import momoConfig from '../config/momo.js';

export const createMoMoPayment = (req, res) => {
  const { amount, orderInfo = 'pay with MoMo', orderId: clientOrderId, redirectUrl: clientRedirectUrl } = req.body;

  const orderId = clientOrderId || momoConfig.partnerCode + new Date().getTime();
  const requestId = orderId;
  const redirectUrl = clientRedirectUrl || momoConfig.redirectUrl;
  const requestType = 'payWithMethod';
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${momoConfig.ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${momoConfig.partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = crypto
    .createHmac('sha256', momoConfig.secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: momoConfig.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: '',
    signature: signature,
  });

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  const momoRequest = https.request(options, momoRes => {
    let data = '';

    momoRes.on('data', chunk => {
      data += chunk;
    });

    momoRes.on('end', () => {
      try {
        const responseData = JSON.parse(data);
        res.status(200).json(responseData);
      } catch (error) {
        res.status(500).json({ message: 'Invalid response from MoMo', error });
      }
    });
  });

  momoRequest.on('error', e => {
    res.status(500).json({ message: 'Failed to connect to MoMo', error: e.message });
  });

  momoRequest.write(requestBody);
  momoRequest.end();
};

export const handleMomoIPN = async (req, res) => {
  const { resultCode, orderId, message } = req.body;

  if (resultCode === 0) {
    console.log('Thanh toán thành công cho order:', orderId);
  } else {
    console.log('Thanh toán thất bại:', message);

      const chiTietList = await getChiTietHoaDonByIdHoaDon(orderId);
      for (const item of chiTietList) {
        await congLaiSoLuongVe(item.idLoaiVe, item.soLuong);
      }

      console.log(`✅ Đã cộng lại vé cho order: ${orderId}`);
    }

    res.status(200).json({ message: 'IPN xử lý xong' });

};
