import mongoose, { Document } from "mongoose";
export interface IClass extends Document {
    class_name: string;
    description?: string;
    categories?: string[];
    class_status: boolean;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Class: mongoose.Model<IClass, {}, {}, {}, mongoose.Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=class.d.ts.map