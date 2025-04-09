import express from 'express';
import { getLoaiVe, getLoaiVeByIDHandler, getVeDaMuaByUserId, getLoaiVeByIDSuatDien, createLoaiVeHandler, updateLoaiVeHandler, deleteLoaiVeHandler } from '../controllers/LoaiVe.js';
import {authenticate, authorize} from "../Middleware/Authen";


const router = express.Router();

//User
router.get('/LoaiVes', getLoaiVe);
router.get('/LoaiVes/:idLoaiVe', getLoaiVeByIDHandler);
router.get('/LoaiVes/SuatDiens/:idSuatDien',getLoaiVeByIDSuatDien);
router.post('/LoaiVes',authenticate, authorize(["User"]), createLoaiVeHandler);
router.put('/LoaiVes/:idLoaiVe',authenticate, authorize(["User"]), updateLoaiVeHandler);
router.delete('/LoaiVes/:idLoaiVe',authenticate, authorize(["User"]), deleteLoaiVeHandler);
router.get('/LoaiVesDaMua/:idNguoiDung',authenticate, authorize(["User"]), getVeDaMuaByUserId);


//Admin
router.get('/Admin/LoaiVes', authenticate, authorize(["Admin"]), getLoaiVe);
export default router;
