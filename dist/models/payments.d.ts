import mongoose, { Document } from "mongoose";
export interface IPayment extends Document {
    student_id: string;
    class_id: string;
    reference?: string;
    payment_date?: Date;
}
export declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=payments.d.ts.map