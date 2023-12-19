import express from "express";
import { sendForogotPasswordEmail } from "../Controller/SendEmail.js";

const router = express.Router();

router.post("/forgot/password", sendForogotPasswordEmail);

export default router;
