import { studentService } from "../services/index.js";
import { z } from "zod";
import mongoose from "mongoose";
const updateSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(), // accepts string & converts to Date
    mobile: z.string(),
    email: z.string().email(),
});
export const studentDetails = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const result = await studentService.getStudentDetails(id);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};
export const allStudents = async (req, res) => {
    try {
        const limit = parseInt(req.query.l, 10) || 10;
        const page = parseInt(req.query.p, 10) || 1;
        const result = await studentService.getAllStudents(limit, page);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
};
export const updateStudent = async (req, res) => {
    try {
        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid data",
                errors: parsed.error.issues
            });
        }
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const result = await studentService.updateStudent(id, parsed.data);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};
export const deleteStudent = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const result = await studentService.deleteStudent(id);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
};
export const changeStudentStatus = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const result = await studentService.changeStudentStatus(id);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
};
export const findStudentById = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const result = await studentService.findStudentById(id);
        const statusCode = result.success ? 200 : 404;
        return res.status(statusCode).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
//# sourceMappingURL=studentController.js.map