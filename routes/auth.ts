import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import { 
    studentRegister, 
    studentLogin,
    teacherRegister,
    teacherLogin,
    adminRegister,
    adminLogin 
} from "../controllers/authController.js";

const router = Router();

// Student routes
router.post("/student/register", asyncHandler(studentRegister));
router.post("/student/login", asyncHandler(studentLogin));

// Teacher routes
router.post("/teacher/register", asyncHandler(teacherRegister));
router.post("/teacher/login", asyncHandler(teacherLogin));

// Admin routes
router.post("/admin/register", asyncHandler(adminRegister));
router.post("/admin/login", asyncHandler(adminLogin));

// Health check
router.get("/check", asyncHandler(
    async (_req, res) => {res.status(200).json({"status": "ok"})}
));

export default router;
