import { Request, Response } from "express";
export declare const createPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentsByStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentsByClass: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const payThisMonthStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=paymentController.d.ts.map