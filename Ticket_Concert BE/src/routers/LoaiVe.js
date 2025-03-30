import express from 'express';
import { getLoaiVe, getLoaiVeByIDHandler, createLoaiVeHandler, updateLoaiVeHandler, deleteLoaiVeHandler } from '../controllers/LoaiVe.js';

const router = express.Router();

router.get('/LoaiVes', getLoaiVe);
router.get('/LoaiVes/:idLoaiVe', getLoaiVeByIDHandler);
router.post('/LoaiVes', createLoaiVeHandler);
router.put('/LoaiVes/:idLoaiVe', updateLoaiVeHandler);
router.delete('/LoaiVes/:idLoaiVe', deleteLoaiVeHandler);

export default router;
