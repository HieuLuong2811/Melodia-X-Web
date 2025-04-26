import express from 'express';
import { createMoMoPayment,handleMomoIPN } from '../controllers/PaymentController.js';

const router = express.Router();

// POST /api/payment/momo
router.post('/momo', createMoMoPayment);
router.post('/payment/momo-ipn', handleMomoIPN);


export default router;
