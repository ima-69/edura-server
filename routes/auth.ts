import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import { 
    studentRegister, 
    studentLogin,
    teacherRegister,
    teacherLogin,
    adminRegister,
    adminLogin,
    universalLogin
} from "../controllers/authController.js";

const router = Router();

// Universal login (auto-detect user type)
router.post("/login", asyncHandler(universalLogin));

// Student routes
router.post("/register/student", asyncHandler(studentRegister));
router.post("/login/student", asyncHandler(studentLogin));

// Teacher routes
router.post("/register/teacher", asyncHandler(teacherRegister));
router.post("/login/teacher", asyncHandler(teacherLogin));

// Admin routes
router.post("/register/admin", asyncHandler(adminRegister));
router.post("/login/admin", asyncHandler(adminLogin));

// Health check
router.get("/check", asyncHandler(
    async (_req, res) => {res.status(200).json({"status": "ok"})}
));

export default router;
