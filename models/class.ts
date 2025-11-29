import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
    class_name: string;
    description?: string;
    categories?: string[];
    class_status: boolean;
    price?: number;
    teacher?: mongoose.Types.ObjectId;
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
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        }
    },
    {
        timestamps:true
    }
)

export const Class = mongoose.model<IClass>("Class", classSchema);

