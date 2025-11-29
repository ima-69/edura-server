import mongoose, { Document, Schema } from "mongoose";

export interface IRegister extends Document {
    student_id: string;
    class_id: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const registerSchema = new Schema<IRegister>(
    {
        student_id : {
            type: String,
            required: true,
        },
        class_id : {
            type: [String],
            required: true,
        }
    },{
        timestamps : true
}
)

export const Register = mongoose.model<IRegister>("Register", registerSchema);

