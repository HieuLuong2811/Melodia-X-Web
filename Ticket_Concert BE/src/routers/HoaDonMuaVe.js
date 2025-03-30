import express from 'express';
import {
    getAllHoaDon,
    getHoaDonByID,
    createHoaDonWithDetails,
    fetchAllHoaDonChiTiet 
} from '../controllers/HoaDonMuaVe.js';

const router = express.Router();

router.get('/HoaDons', getAllHoaDon);
router.get('/HoaDons/details', fetchAllHoaDonChiTiet);
router.get('/HoaDons/:idHoaDon', getHoaDonByID);
router.post('/HoaDons/', createHoaDonWithDetails);

export default router;
