import express from 'express';
import { getNguoiDung, getNguoiDungByID, createNguoiDung, updateNguoiDung, deleteNguoiDung } from '../controllers/NguoiDung.js';

const router = express.Router();

router.get('/NguoiDungs', getNguoiDung);
router.get(`/NguoiDungs/:idNguoiDung`, getNguoiDungByID);
router.post('/NguoiDungs', createNguoiDung);
router.put('/NguoiDungs/:idNguoiDung', updateNguoiDung);
router.delete('/NguoiDungs/:idNguoiDung', deleteNguoiDung);

export default router;
