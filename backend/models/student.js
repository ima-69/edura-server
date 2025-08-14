import mongoose from "mongoose";
import bcrypt from "bcrypt"

const studentSchema = new mongoose.Schema(
    {
        first_name: {type: String, required: true, trim: true},
        last_name: {type: String, required: true, trim: true},
        password: {type: String, required: true}
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