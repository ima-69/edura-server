import { Request, Response } from "express";
export declare const studentRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const teacherRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const studentLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const teacherLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map