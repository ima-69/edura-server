import mongoose, { Document } from "mongoose";
export interface IStudent extends Document {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string;
    password: string;
    student_status: boolean;
    date_of_birth?: Date;
    classes?: mongoose.Types.ObjectId[];
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