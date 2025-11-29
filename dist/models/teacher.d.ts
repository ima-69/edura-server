import mongoose, { Document } from "mongoose";
export interface ITeacher extends Document {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string;
    password: string;
    teacher_status: boolean;
    subjects?: string[];
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}
export declare const Teacher: mongoose.Model<ITeacher, {}, {}, {}, mongoose.Document<unknown, {}, ITeacher, {}, {}> & ITeacher & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=teacher.d.ts.map