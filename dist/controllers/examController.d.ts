import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
export declare const createExam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteExam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getExam: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const checkExamMcq: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=examController.d.ts.map