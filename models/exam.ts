import mongoose, { Document, Schema } from "mongoose";

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

const mcqSchema = new Schema<IMCQ>({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [String], 
        required: true
    },
    correct_answer: {
        type: [Number], // (supports MSQ)
        required: true
    }
});

const examSchema = new Schema<IExam>(
    {
        exam_name: {
            type: String,
            required: true
        },
        exam_description: {
            type: String,
            required: true
        },
        exam_type: {
            type: Schema.Types.Mixed, 
            required: true
        },
        class_id: {
            type: String,
            required: true
        },
        additional: {
            type: String
        },
        duration: {
            type: Number,   // minutes
            required: true
        },
        mcq: {
            type: [mcqSchema],  // array of MCQ objects
            default: []
        }
    },
    {
        timestamps: true
    }
);

examSchema.pre("save", function (next) {
    if (this.isModified("exam_type")) {
        const typeValue = String(this.exam_type).toLowerCase();

        if (typeValue === "mcq" || typeValue === "1") {
            this.exam_type = 1;
        } else if (typeValue === "essay" || typeValue === "2") {
            this.exam_type = 2;
        }
    }

    next();
});

export default mongoose.model<IExam>("Exam", examSchema);

