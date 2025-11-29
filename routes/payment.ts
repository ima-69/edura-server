import { Router } from "express";
import { createPayment, getPaymentsByClass, getPaymentsByStudent, payThisMonthStudent } from "../controllers/paymentController.js";
import { auth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/handler.js";

const router = Router();

router.post("/paymentCreate", auth(true), asyncHandler(createPayment));
router.get("/paymentByStudent", auth(true), asyncHandler(getPaymentsByStudent));
router.get("/paymentByClass", auth(true), asyncHandler(getPaymentsByClass));
router.get("/paymentInThisMonth", auth(true), asyncHandler(payThisMonthStudent));

export default router;

