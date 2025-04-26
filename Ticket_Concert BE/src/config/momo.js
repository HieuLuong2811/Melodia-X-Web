const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl : 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
  ipnUrl: "http://localhost:3000/api/payment/momo-ipn",
};

export default momoConfig;
