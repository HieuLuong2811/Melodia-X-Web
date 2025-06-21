import express from 'express';
import ChiTietHoaDonController from '../controllers/ChiTietHoaDon.js';

const router = express.Router();

router.get('/ChiTietHoaDons', ChiTietHoaDonController.getChiTietHoaDonCtrl);
router.get('/ChiTietHoaDons/:idChiTietHoaDons', ChiTietHoaDonController.getChiTietHoaDonByIDCtrl);
router.post('/ChiTietHoaDons', ChiTietHoaDonController.createChiTietHoaDonCtrl);

export default router;
