import mongoose, { Schema } from "mongoose";
const classSchema = new Schema({
    class_name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    categories: {
        type: [String],
    },
    class_status: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, {
    timestamps: true
});
export const Class = mongoose.model("Class", classSchema);
//# sourceMappingURL=class.js.map