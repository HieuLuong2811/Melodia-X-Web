import express from 'express';
import { getAllSuatDien, getSuatDienByID, createSuatDien, updateSuatDien, deleteSuatDien } from '../controllers/SuatDien.js';

const router = express.Router();

router.get('/SuatDiens', getAllSuatDien);
router.get('/SuatDiens/:idSuatDien', getSuatDienByID);
router.post('/SuatDiens', createSuatDien);
router.put('/SuatDiens/:idSuatDien', updateSuatDien);
router.delete('/SuatDiens/:idSuatDien', deleteSuatDien);

export default router;
