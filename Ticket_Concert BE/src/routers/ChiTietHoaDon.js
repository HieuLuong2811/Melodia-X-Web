import express from 'express';
import { getChiTietHoaDon, getChiTietHoaDonByID, createChiTietHoaDon } from '../controllers/ChiTietHoaDon.js';

const router = express.Router();

router.get('/ChiTietHoaDons', getChiTietHoaDon);
router.get('/ChiTietHoaDons/:idChiTietHoaDons', getChiTietHoaDonByID);
router.post('/ChiTietHoaDons', createChiTietHoaDon);

export default router;
