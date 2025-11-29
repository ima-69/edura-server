import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IStudent extends Document {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string; // National Identity Card
    password: string;
    student_status: boolean;
    date_of_birth?: Date;
    classes?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>(
    {
        first_name: {
            type: String, 
            required: [true, 'First name is required'],
            trim: true
        },
        last_name: {
            type: String, 
            required: [true, 'Last name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            trim: true
        },
        nic: {
            type: String,
            required: [true, 'National Identity Card number is required'],
            unique: true,
            trim: true
        },
        password: {
            type: String, 
            required: [true, 'Password is required'],
            minLength: [6, 'Password must be at least 6 characters']
        },
        student_status:{
            type: Boolean, 
            default: true
        },
        date_of_birth: {
            type: Date
        },
        classes: {
            type: [Schema.Types.ObjectId],
            ref: 'Class',
            default: []
        }
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

