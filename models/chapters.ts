import mongoose, { Document, Schema } from "mongoose";

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

const chapterSchema = new Schema<IChapters>(
    {
        class_id: {
            type: String,
            required: true,
        },
        chapter_name: {
            type: String,
            required: true,
        },
        chapter_url: {
            type: [String],
            required: true,
        },
        chapter_description: {
            type: String,
        },
        chapter_notes: {
            type: [String],
        },
        chapter_status: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
)

export const Chapters = mongoose.model<IChapters>("Chapters", chapterSchema);

