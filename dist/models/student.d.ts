import mongoose, { Document } from "mongoose";
export interface IStudent extends Document {
    first_name: string;
    last_name: string;
    password: string;
    date_of_birth?: Date;
    student_status: boolean;
    mobile?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}
export declare const Student: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=student.d.ts.map