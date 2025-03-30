import express from 'express';
import { getLoaiSuKien, getLoaiSuKienByID, createLoaiSuKien, updateLoaiSuKien, deleteLoaiSuKien } from '../controllers/LoaiSuKien.js';

const router = express.Router();

router.get('/LoaiSuKiens', getLoaiSuKien);
router.get(`/LoaiSuKiens/:idLoaiSuKien`, getLoaiSuKienByID);
router.post('/LoaiSuKiens', createLoaiSuKien);
router.put('/LoaiSuKiens/:idLoaiSuKien', updateLoaiSuKien);
router.delete('/LoaiSuKiens/:idLoaiSuKien', deleteLoaiSuKien);

export default router;
