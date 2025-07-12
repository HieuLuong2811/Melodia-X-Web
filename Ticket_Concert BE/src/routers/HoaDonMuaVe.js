import express from 'express';
import HoaDonMuaVeController from '../controllers/HoaDonMuaVe.js';
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get('/HoaDons', authenticate, (req, res, next) => {
    if(req.user.userId == req.params.IDNguoiDung){
        next();
    }
    return res.status()
}, HoaDonMuaVeController.getAllHoaDonCtrl);


router.get('/HoaDons/details', HoaDonMuaVeController.fetchAllHoaDonChiTietCtrl);
router.get('/HoaDons/:idHoaDon', HoaDonMuaVeController.getHoaDonByIDCtrl);
router.get('/HoaDonsBySuatDien/:idSuatDien', HoaDonMuaVeController.getHoaDonByIDsuatdienCtrl);
router.post('/HoaDons/', HoaDonMuaVeController.createHoaDonWithDetailsCtrl);
router.delete('/HoaDons/:idHoaDon', HoaDonMuaVeController.deleteHoaDonCtrl);

export default router;
