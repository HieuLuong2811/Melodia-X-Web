import express from 'express';
import { getLoaiSuKien, getLoaiSuKienByID, createLoaiSuKien, updateLoaiSuKien, deleteLoaiSuKien } from '../controllers/LoaiSuKien.js';
import { authenticate, authorize } from "../Middleware/Authen";

const router = express.Router();

router.get('/LoaiSuKiens', getLoaiSuKien);

router.get(`/LoaiSuKiens/:idLoaiSuKien`, authenticate, authorize(["Admin"]), getLoaiSuKienByID);

router.post('/LoaiSuKiens', authenticate, authorize(["Admin"]), createLoaiSuKien);

router.put('/LoaiSuKiens/:idLoaiSuKien', authenticate, authorize(["Admin"]), updateLoaiSuKien);

router.delete('/LoaiSuKiens/:idLoaiSuKien', authenticate, authorize(["Admin"]), deleteLoaiSuKien);

export default router;
