import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const teacherSchema = new Schema({
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
    teacher_status: {
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
}, {
    timestamps: true
});
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
teacherSchema.methods.comparePassword = async function (p) {
    return bcrypt.compare(p, this.password);
};
export const Teacher = mongoose.model("Teacher", teacherSchema);
//# sourceMappingURL=teacher.js.map