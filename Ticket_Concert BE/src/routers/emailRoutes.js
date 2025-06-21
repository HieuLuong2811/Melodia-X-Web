import express from "express"
const router = express.Router();
import {sendEmails,payticketpass}  from "../controllers/emailController.js"

router.post("/send-emails", sendEmails);
router.post("/pay-ticket-pass", payticketpass);

export default router;