import express from 'express';
import {
    getAllHoaDon,
    getHoaDonByID,
    createHoaDonWithDetails,
    fetchAllHoaDonChiTiet 
} from '../controllers/HoaDonMuaVe.js';
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get('/HoaDons', authenticate, (req, res, next) => {
    if(req.user.userId == req.params.IDNguoiDung){
        next();
    }
    return res.status()
}, getAllHoaDon);


router.get('/HoaDons/details', fetchAllHoaDonChiTiet);
router.get('/HoaDons/:idHoaDon', getHoaDonByID);
router.post('/HoaDons/', createHoaDonWithDetails);

export default router;
