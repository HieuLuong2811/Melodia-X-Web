import express from 'express';
import { getAllDangKyTaoSuKien, getDangKyTaoSuKienByID, createDangKyTaoSuKien, deleteDangKyTaoSuKien } from '../controllers/DangKySuKien.js';

const router = express.Router();

router.get('/DangKys', getAllDangKyTaoSuKien);
router.get('/DangKys/:idDangKy', getDangKyTaoSuKienByID);
router.post('/DangKys', createDangKyTaoSuKien);
router.delete('/DangKys/:idDangKy', deleteDangKyTaoSuKien);

export default router;

