import { Class } from "../models/class.js";
import { z } from "zod";
import mongoose from "mongoose";
const createClassSchema = z.object({
    class_name: z.string().min(1, "class_name is required"),
    description: z.string().min(1, "description is required"),
    categories: z.array(z.string()).optional(),
    price: z.coerce.number().positive("price must be a positive number"),
});
export const createClass = async (req, res) => {
    try {
        const newClass = createClassSchema.safeParse(req.body);
        console.log(newClass);
        if (!newClass.success) {
            return res.status(400).json({
                message: "Invalid inputs",
                errors: newClass.error.issues
            });
        }
        const class_ = await Class.create(newClass.data);
        return res.status(201).json({
            message: "student register success",
            data: {
                class: {
                    id: class_._id,
                    class_name: class_.class_name,
                    description: class_.description,
                    categories: class_.categories,
                    price: class_.price,
                    class_status: class_.class_status,
                    created: class_.createdAt,
                    updated: class_.updatedAt,
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": e
        });
    }
};
const classUpdateSchema = z.object({
    class_name: z.string().min(1, "class_name is required"),
    description: z.string().min(1, "description is required"),
    categories: z.array(z.string()).optional(),
    price: z.coerce.number().positive("price must be a positive number"),
});
export const updateClass = async (req, res) => {
    try {
        const passSchema = classUpdateSchema.safeParse(req.body);
        if (!passSchema.success) {
            return res.status(400).json({
                "message": "Invalid inputs",
                errors: passSchema.error.issues
            });
        }
        const id = req.query.class_id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid class id" });
        }
        const updateClass = await Class.findByIdAndUpdate(id, passSchema.data, { new: true });
        if (!updateClass) {
            return res.status(404).json({
                "message": "class not found"
            });
        }
        return res.status(200).json({
            "message": "Class updated successfully",
            data: {
                class: {
                    id: updateClass._id,
                    class_name: updateClass.class_name,
                    description: updateClass.description,
                    categories: updateClass.categories,
                    price: updateClass.price,
                    class_status: updateClass.class_status,
                    created: updateClass.createdAt,
                    updated: updateClass.updatedAt,
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": e.message
        });
    }
};
export const allClasses = async (_req, res) => {
    try {
        const classes = await Class.find();
        const classArray = classes.map(class_ => ({
            id: class_._id,
            class_name: class_.class_name,
            description: class_.description,
            categories: class_.categories,
            price: class_.price,
            class_status: class_.class_status,
            created: class_.createdAt,
            updated: class_.updatedAt,
        }));
        if (classArray.length === 0) {
            return res.status(200).json({
                "message": "Classes is empty"
            });
        }
        return res.status(200).json({
            "message": "Class list ",
            "data": {
                classArray
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": e.message
        });
    }
};
export const changeClassStatus = async (req, res) => {
    try {
        const id = req.query.class_id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid class id" });
        }
        const class_ = await Class.findByIdAndUpdate(id, [{ $set: { class_status: { $not: "$class_status" } } }], { new: true });
        if (!class_) {
            return res.status(404).json({
                message: "Class not found"
            });
        }
        return res.status(200).json({
            message: "class change status success",
            data: {
                class: {
                    id: class_._id,
                    class_name: class_.class_name,
                    description: class_.description,
                    categories: class_.categories,
                    price: class_.price,
                    class_status: class_.class_status,
                    created: class_.createdAt,
                    updated: class_.updatedAt,
                }
            }
        });
    }
    catch (e) {
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": e.message
        });
    }
};
export const deleteClass = async (req, res) => {
    try {
        const id = req.query.class_id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid class id" });
        }
        const result = await Class.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({
                "message": "Class not found"
            });
        }
        return res.status(200).json({
            "message": "Class deleted successfully"
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": e.message
        });
    }
};
//# sourceMappingURL=classControlers.js.map