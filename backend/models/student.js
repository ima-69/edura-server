import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { boolean } from "zod";

const studentSchema = new mongoose.Schema(
    {
        first_name: {type: String, required: true, trim: true},
        last_name: {type: String, required: true, trim: true},
        password: {type: String, required: true},
        date_of_birth: {type: Date},
        student_status:{type: boolean, default: true}
    }
);

studentSchema.pre("save", async(next) => {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

studentSchema.methods.comparepassword = (p) => {
    return bcrypt.compare(p, this.password);
}

export const Student = mongoose.Model("Student",studentSchema);