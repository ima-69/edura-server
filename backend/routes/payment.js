import express from "express";
import {createPayment, getPaymentsByClass, getPaymentsByStudent} from "../controllers/paymentController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();


router.post("/payment",auth(true) ,createPayment);
router.get("/paymentByStudent",auth(true) , getPaymentsByStudent);
router.get("/paymentByClass",auth(true) , getPaymentsByClass);

export default router;