import express from 'express';
import ThongTinThanhToanController from '../controllers/ThongTinThanhToan.js';

const router = express.Router();

router.get('/GiaoDichs', ThongTinThanhToanController.getThongTinThanhToanCtrl);
router.get('/GiaoDichs/:idNguoiDung', ThongTinThanhToanController.getThongTinThanhToanByIDCtrl);
router.post('/GiaoDichs', ThongTinThanhToanController.createThongTinThanhToanCtrl);
router.put('/GiaoDichs/:idThongTin', ThongTinThanhToanController.updateThongTinThanhToanCtrl);
router.delete('/GiaoDichs/:idThongTin', ThongTinThanhToanController.deleteThongTinThanhToanCtrl);

export default router;
