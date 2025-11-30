import { Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/index.js";

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
        const result = await authService.universalLogin(email, password);

        const statusCode = result.success ? 200 : (result.message.includes("not found") ? 404 : 401);
        return res.status(statusCode).json(result);
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

        const result = await authService.registerStudent(validation.data);
        const statusCode = result.success ? 201 : 409;
        return res.status(statusCode).json(result);
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

        const result = await authService.registerTeacher(validation.data);
        const statusCode = result.success ? 201 : 409;
        return res.status(statusCode).json(result);
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

        const result = await authService.registerAdmin(validation.data);
        const statusCode = result.success ? 201 : 409;
        return res.status(statusCode).json(result);
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

        const { email, password } = validation.data;
        const result = await authService.loginStudent(email, password);

        const statusCode = result.success ? 200 : (result.message === "Student not found" ? 404 : 401);
        return res.status(statusCode).json(result);
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

        const { email, password } = validation.data;
        const result = await authService.loginTeacher(email, password);

        const statusCode = result.success ? 200 : (result.message === "Teacher not found" ? 404 : 401);
        return res.status(statusCode).json(result);
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

        const { email, password } = validation.data;
        const result = await authService.loginAdmin(email, password);

        const statusCode = result.success ? 200 : 401;
        return res.status(statusCode).json(result);
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
