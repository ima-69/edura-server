import {Router} from "express";
import {auth} from "../middlewares/auth.js";
import { asyncHandler } from "../utils/handler.js";
import {createExam} from "../controllers/examController.js"

const router = Router()

router.post("/createExam", auth(true), asyncHandler(createExam));


export default router