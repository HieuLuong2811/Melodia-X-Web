import express from 'express';
import { 
    getThongTinThanhToan, 
    getThongTinThanhToanByID, 
    createThongTinThanhToan, 
    updateThongTinThanhToan, 
    deleteThongTinThanhToan, 
} from '../controllers/ThongTinThanhToan.js';

const router = express.Router();

router.get('/GiaoDichs', getThongTinThanhToan);
router.get('/GiaoDichs/:idNguoiDung', getThongTinThanhToanByID);
router.post('/GiaoDichs', createThongTinThanhToan);
router.put('/GiaoDichs/:idThongTin', updateThongTinThanhToan);
router.delete('/GiaoDichs/:idThongTin', deleteThongTinThanhToan);

export default router;
