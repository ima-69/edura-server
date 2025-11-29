import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string; // National Identity Card
    password: string;
    role: 'superadmin' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
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
        role: {
            type: String,
            enum: ['superadmin', 'admin'],
            default: 'admin'
        },
    },
    {
        timestamps: true
    }
)

adminSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

adminSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

