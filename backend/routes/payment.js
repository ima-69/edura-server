import express from "express";
import {createPayment, getPaymentsByClass, getPaymentsByStudent} from "../controllers/paymentController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();


router.post("/payment", createPayment);
router.get("/paymentByStudent", getPaymentsByStudent);
router.get("/paymentByClass", getPaymentsByClass);

export default router;