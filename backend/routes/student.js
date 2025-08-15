import {Router} from "express";
import {auth} from "../middlewares/auth.js";
import { asyncHandler } from "../utils/handler.js";
import {studentDetails, allStudents} from "../controllers/studentController.js";


const router = Router();
router.get("/studentDetails", auth(true),asyncHandler(studentDetails));
router.get("/allStudents",auth(true), asyncHandler(allStudents));

export default router;