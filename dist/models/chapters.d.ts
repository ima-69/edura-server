import mongoose, { Document } from "mongoose";
export interface IChapters extends Document {
    class_id: string;
    chapter_name: string;
    chapter_url: string[];
    chapter_description?: string;
    chapter_notes?: string[];
    chapter_status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Chapters: mongoose.Model<IChapters, {}, {}, {}, mongoose.Document<unknown, {}, IChapters, {}, {}> & IChapters & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=chapters.d.ts.map