import { Request, Response } from "express";
export declare const studentDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const allStudents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteStudent: (req: Request, res: Response) => Promise<Response>;
export declare const changeStudentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const findStudentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=studentController.d.ts.map