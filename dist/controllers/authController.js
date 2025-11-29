import jwt from "jsonwebtoken";
import { z } from "zod";
import { Student } from "../models/student.js";
import { Admin } from "../models/admin.js";
const registerSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    password: z.string(),
    date_of_birth: z.coerce.date(), // accepts string & converts to Date
    mobile: z.string(),
    email: z.string().email(),
});
const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
});
const studentToken = (Student) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    };
    return jwt.sign({
        email: Student.email,
        first_name: Student.first_name,
        last_name: Student.last_name,
        mobile: Student.mobile,
        student_status: Student.student_status,
        role: "student",
        sub: Student._id.toString()
    }, secret, options);
};
const adminToken = (Admin) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    };
    return jwt.sign({
        email: Admin.email,
        first_name: Admin.name,
        role: "admin",
        sub: Admin._id.toString()
    }, secret, options);
};
export const studentRegister = async (req, res) => {
    try {
        console.log(req.body);
        const tmp = registerSchema.safeParse(req.body);
        if (!tmp.success) {
            return res.status(400).json({
                "message": tmp.error.message,
            });
        }
        const studentExist = await Student.findOne({ email: tmp.data.email });
        if (studentExist) {
            return res.status(409).json({
                "message": "Student already exist",
            });
        }
        const student = await Student.create(tmp.data);
        const token = studentToken(student);
        return res.status(201).json({
            message: "student register success",
            token,
            data: {
                student: {
                    id: student._id,
                    email: student.email,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    mobile: student.mobile,
                    student_status: student.student_status,
                    role: "student",
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal server error",
        });
    }
};
export const studentLogin = async (req, res) => {
    try {
        const tmp = loginSchema.safeParse(req.body);
        if (!tmp.success) {
            return res.status(400).json({
                "message": tmp.error.message,
            });
        }
        const student = await Student.findOne({ email: tmp.data.email }).select("+password");
        if (student) {
            const k = await student.comparePassword(tmp.data.password);
            if (k) {
                // create token
                const token = studentToken(student);
                return res.status(200).json({
                    message: "student login success",
                    token,
                    data: {
                        student: {
                            id: student._id,
                            email: student.email,
                            first_name: student.first_name,
                            last_name: student.last_name,
                            mobile: student.mobile,
                            student_status: student.student_status,
                            role: "student",
                        }
                    }
                });
            }
            else {
                return res.status(400).json({
                    "message": "Student Login Failed",
                });
            }
        }
        else {
            return res.status(404).json({
                "message": "Student Not Found",
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Server error",
        });
    }
};
export const adminLogin = async (req, res) => {
    try {
        const tmp = loginSchema.safeParse(req.body);
        if (!tmp.success) {
            return res.status(400).json({
                "message": tmp.error.message,
            });
        }
        const admin = await Admin.findOne({ email: tmp.data.email }).select("+password");
        if (!admin) {
            return res.status(400).json({
                "message": "Admin not found",
            });
        }
        const isPasswordValid = await admin.comparePassword(tmp.data.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                "message": "Invalid password",
            });
        }
        const token = adminToken(admin);
        return res.status(200).json({
            message: "admin login success",
            token,
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    first_name: admin.name,
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Internal server error",
        });
    }
};
//# sourceMappingURL=authController.js.map