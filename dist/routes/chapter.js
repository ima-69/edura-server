import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/handler.js";
import { createChapter, updateChapter, deleteChapter, classChapters } from "../controllers/chapterControler.js";
const router = Router();
router.post("/createChapter", auth(true), asyncHandler(createChapter));
router.put("/updateChapter", auth(true), asyncHandler(updateChapter));
router.delete("/deleteChapter", auth(true), asyncHandler(deleteChapter));
router.get("/classChapter", auth(true), asyncHandler(classChapters));
export default router;
//# sourceMappingURL=chapter.js.map