import mongoose, { Document } from "mongoose";
export interface IRegister extends Document {
    student_id: string;
    class_id: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Register: mongoose.Model<IRegister, {}, {}, {}, mongoose.Document<unknown, {}, IRegister, {}, {}> & IRegister & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=register.d.ts.map