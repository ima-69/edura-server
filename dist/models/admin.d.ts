import mongoose, { Document } from "mongoose";
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}
export declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=admin.d.ts.map