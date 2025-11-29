import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IStudent extends Document {
    first_name: string;
    last_name: string;
    password: string;
    date_of_birth?: Date;
    student_status: boolean;
    mobile?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>(
    {
        first_name: {
            type: String, 
            required: true, 
            trim: true
        },
        last_name: {
            type: String, 
            required: true, 
            trim: true
        },
        password: {
            type: String, 
            required: true
        },
        date_of_birth: {
            type: Date
        },
        student_status:{
            type: Boolean, 
            default: true
        },
        mobile: {
            type: String, 
            maxLength: 13,
            minLength:10, 
            unique:true
        },
        email: {
            type: String, 
            unique: true 
        },
        
    },
    {
        timestamps: true
    }
);

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

studentSchema.methods.comparePassword = async function (p: string): Promise<boolean> {
    return bcrypt.compare(p, this.password);
};

export const Student = mongoose.model<IStudent>("Student", studentSchema);

