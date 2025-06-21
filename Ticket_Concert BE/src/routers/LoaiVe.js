import express from 'express';
import LoaiVeController from '../controllers/LoaiVe.js';
import {authenticate, authorize} from "../Middleware/Authen.js"


const router = express.Router();

//User
router.get('/LoaiVes', LoaiVeController.getLoaiVeCtrl);
router.get('/LoaiVes/:idLoaiVe', LoaiVeController.getLoaiVeByIDCtrl);
router.get('/LoaiVes/SuatDiens/:idSuatDien', LoaiVeController.getLoaiVeByIDSuatDienCtrl);
router.post('/LoaiVes',authenticate, authorize(["User"]), LoaiVeController.createLoaiVeCtrl);
router.put('/LoaiVes/:idLoaiVe',authenticate, authorize(["User"]), LoaiVeController.updateLoaiVeCtrl);
router.delete('/LoaiVes/:idLoaiVe',authenticate, authorize(["User"]), LoaiVeController.deleteLoaiVeCtrl);
router.get('/LoaiVesDaMua/:idNguoiDung',authenticate, authorize(["User"]), LoaiVeController.getVeDaMuaByUserIdCtrl);


//Admin
router.get('/Admin/LoaiVes', authenticate, authorize(["Admin"]), LoaiVeController.getLoaiVeCtrl);
export default router;
