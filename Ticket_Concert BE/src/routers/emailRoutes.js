import express from "express"
const router = express.Router();
import sendEmails from "../controllers/emailController"

router.post("/send-emails", sendEmails);

export default router;