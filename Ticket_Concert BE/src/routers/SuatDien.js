import express from 'express';
import { getAllSuatDiens, getSuatDienByIDSuKien, createSuatDiens, updateSuatDien, deleteSuatDien } from '../controllers/SuatDien.js';
import {authenticate, authorize} from "../Middleware/Authen";

const router = express.Router();

router.get('/SuatDiens', getAllSuatDiens);
router.get('/SuatDiens/:idSuKien', getSuatDienByIDSuKien);
router.post('/SuatDiens', authenticate, authorize(["User"]), createSuatDiens);
router.put('/SuatDiens/:idSuatDien',authenticate, authorize(["User"]), updateSuatDien);
router.delete('/SuatDiens/:idSuatDien', authenticate, authorize(["User"]), deleteSuatDien);

export default router;
