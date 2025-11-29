import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { Student } from "../models/student.js";
import { Teacher } from "../models/teacher.js";
import { Admin } from "../models/admin.js";

// Sri Lankan NIC validation regex (Old: 9 digits + V/X, New: 12 digits)
const nicRegex = /^(?:\d{9}[VvXx]|\d{12})$/;
const mobileRegex = /^(?:\+94|0)?[0-9]{9}$/;

// Registration Schemas
const studentRegisterSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    mobile: z.string().regex(mobileRegex, 'Invalid mobile number format'),
    nic: z.string().regex(nicRegex, 'Invalid NIC format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const teacherRegisterSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    mobile: z.string().regex(mobileRegex, 'Invalid mobile number format'),
    nic: z.string().regex(nicRegex, 'Invalid NIC format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const adminRegisterSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    mobile: z.string().regex(mobileRegex, 'Invalid mobile number format'),
    nic: z.string().regex(nicRegex, 'Invalid NIC format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// Token generation functions
const generateToken = (userId: string, email: string, firstName: string, lastName: string, role: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as SignOptions;
    return jwt.sign(
        {
            email,
            first_name: firstName,
            last_name: lastName,
            role,
            sub: userId
        }, 
        secret as any,
        options
    );
};

// Universal Login - Automatically detects user type
export const universalLogin = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const { email, password } = validation.data;

        // Try to find user in all collections
        let user: any = null;
        let userType: string = '';

        // Check Student
        user = await Student.findOne({ email }).select("+password");
        if (user) {
            userType = 'student';
        }

        // Check Teacher if not found
        if (!user) {
            user = await Teacher.findOne({ email }).select("+password");
            if (user) {
                userType = 'teacher';
            }
        }

        // Check Admin if not found
        if (!user) {
            user = await Admin.findOne({ email }).select("+password");
            if (user) {
                userType = 'admin';
            }
        }

        // If no user found in any collection
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please check your email address."
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate token
        const token = generateToken(
            user._id.toString(),
            user.email,
            user.first_name,
            user.last_name,
            userType
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                role: userType
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Student Registration
export const studentRegister = async (req: Request, res: Response) => {
    try {
        const validation = studentRegisterSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const { email, mobile, nic } = validation.data;

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });

        if (existingStudent) {
            let message = "Student already exists";
            if (existingStudent.email === email) message = "Email already registered";
            if (existingStudent.mobile === mobile) message = "Mobile number already registered";
            if (existingStudent.nic === nic) message = "NIC already registered";
            
            return res.status(409).json({
                success: false,
                message
            });
        }

        const student = await Student.create(validation.data);
        const token = generateToken(
            student._id.toString(),
            student.email,
            student.first_name,
            student.last_name,
            'student'
        );

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            token,
            data: {
                id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                mobile: student.mobile,
                role: 'student'
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Teacher Registration
export const teacherRegister = async (req: Request, res: Response) => {
    try {
        const validation = teacherRegisterSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const { email, mobile, nic } = validation.data;

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });

        if (existingTeacher) {
            let message = "Teacher already exists";
            if (existingTeacher.email === email) message = "Email already registered";
            if (existingTeacher.mobile === mobile) message = "Mobile number already registered";
            if (existingTeacher.nic === nic) message = "NIC already registered";
            
            return res.status(409).json({
                success: false,
                message
            });
        }

        const teacher = await Teacher.create(validation.data);
        const token = generateToken(
            teacher._id.toString(),
            teacher.email,
            teacher.first_name,
            teacher.last_name,
            'teacher'
        );

        return res.status(201).json({
            success: true,
            message: "Teacher registered successfully",
            token,
            data: {
                id: teacher._id,
                first_name: teacher.first_name,
                last_name: teacher.last_name,
                email: teacher.email,
                mobile: teacher.mobile,
                role: 'teacher'
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Admin Registration
export const adminRegister = async (req: Request, res: Response) => {
    try {
        const validation = adminRegisterSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const { email, mobile, nic } = validation.data;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });

        if (existingAdmin) {
            let message = "Admin already exists";
            if (existingAdmin.email === email) message = "Email already registered";
            if (existingAdmin.mobile === mobile) message = "Mobile number already registered";
            if (existingAdmin.nic === nic) message = "NIC already registered";
            
            return res.status(409).json({
                success: false,
                message
            });
        }

        const admin = await Admin.create({
            ...validation.data,
            role: 'superadmin'
        });
        
        const token = generateToken(
            admin._id.toString(),
            admin.email,
            admin.first_name,
            admin.last_name,
            'superadmin'
        );

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            data: {
                id: admin._id,
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Student Login
export const studentLogin = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const student = await Student.findOne({ email: validation.data.email }).select("+password");
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const isPasswordValid = await student.comparePassword(validation.data.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = generateToken(
            student._id.toString(),
            student.email,
            student.first_name,
            student.last_name,
            'student'
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                mobile: student.mobile,
                role: 'student'
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Teacher Login
export const teacherLogin = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const teacher = await Teacher.findOne({ email: validation.data.email }).select("+password");
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        const isPasswordValid = await teacher.comparePassword(validation.data.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = generateToken(
            teacher._id.toString(),
            teacher.email,
            teacher.first_name,
            teacher.last_name,
            'teacher'
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: teacher._id,
                first_name: teacher.first_name,
                last_name: teacher.last_name,
                email: teacher.email,
                mobile: teacher.mobile,
                role: 'teacher'
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const admin = await Admin.findOne({ email: validation.data.email }).select("+password");
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await admin.comparePassword(validation.data.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(
            admin._id.toString(),
            admin.email,
            admin.first_name,
            admin.last_name,
            admin.role
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: admin._id,
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role
            }
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
