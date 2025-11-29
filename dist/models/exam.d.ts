import mongoose, { Document } from "mongoose";
export interface IMCQ {
    question: string;
    answers: string[];
    correct_answer: number[];
}
export interface IExam extends Document {
    exam_name: string;
    exam_description: string;
    exam_type: number | string;
    class_id: string;
    additional?: string;
    duration: number;
    mcq: IMCQ[];
}
declare const _default: mongoose.Model<IExam, {}, {}, {}, mongoose.Document<unknown, {}, IExam, {}, {}> & IExam & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=exam.d.ts.map