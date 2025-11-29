import { Request, Response } from "express";
export declare const creteStudentRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const registerClassByFindClassId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const registerClassByFindStudentId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllRegisters: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteRegisterClassByRegisterId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=registerController.d.ts.map