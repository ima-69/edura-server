import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
    student_id: string;
    class_id: string;
    reference?: string;
    payment_date?: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        student_id: {
            type: String,
            required: true
        },
        class_id: {
            type: String,
            required: true
        },
        reference: {
            type: String
        },
        payment_date: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);


