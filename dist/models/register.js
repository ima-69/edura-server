import mongoose, { Schema } from "mongoose";
const registerSchema = new Schema({
    student_id: {
        type: String,
        required: true,
    },
    class_id: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
});
export const Register = mongoose.model("Register", registerSchema);
//# sourceMappingURL=register.js.map