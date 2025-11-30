import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface ITeacher extends Document {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string; // National Identity Card
    password: string;
    teacher_status: boolean;
    subjects?: string[];
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const teacherSchema = new Schema<ITeacher>(
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
        teacher_status:{
            type: Boolean, 
            default: true
        },
        subjects: {
            type: [String],
            default: []
        },
        bio: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

teacherSchema.methods.comparePassword = async function (p: string): Promise<boolean> {
    return bcrypt.compare(p, this.password);
};

export const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);



