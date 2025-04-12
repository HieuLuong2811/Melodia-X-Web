import express from 'express';
import { createMoMoPayment, handleMoMoIPN } from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/payment/momo', createMoMoPayment);
router.post('/payment/momo-ipn', handleMoMoIPN); 

export default router;
