import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
    class_name: string;
    description?: string;
    categories?: string[];
    class_status: boolean;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const classSchema = new Schema<IClass>(
    {
        class_name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        categories: {
            type: [String],
        },
        class_status: {
            type: Boolean,
            default: true
        },
        price: {
            type: Number
        }
    },
    {
        timestamps:true
    }
)

export const Class = mongoose.model<IClass>("Class", classSchema);

