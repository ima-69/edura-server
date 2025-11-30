import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { studentRepository, teacherRepository, adminRepository } from "../repositories/index.js";
import { IStudent } from "../models/student.js";
import { ITeacher } from "../models/teacher.js";
import { IAdmin } from "../models/admin.js";

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    nic: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    data?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        mobile?: string;
        role: string;
    };
    errors?: Array<{ field: string | number; message: string }>;
}

export class AuthService {
    /**
     * Generate JWT token
     */
    private generateToken(userId: string, email: string, firstName: string, lastName: string, role: string): string {
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
    }

    /**
     * Format user response
     */
    private formatUserResponse(user: IStudent | ITeacher | IAdmin, role: string): AuthResponse['data'] {
        return {
            id: user._id.toString(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile: user.mobile,
            role
        };
    }

    /**
     * Universal Login - Auto-detect user type
     */
    async universalLogin(email: string, password: string): Promise<AuthResponse> {
        try {
            // Try to find user in all collections
            let user: IStudent | ITeacher | IAdmin | null = null;
            let userType: string = '';

            // Check Student
            user = await studentRepository.findByEmail(email);
            if (user) {
                userType = 'student';
            }

            // Check Teacher if not found
            if (!user) {
                user = await teacherRepository.findByEmail(email);
                if (user) {
                    userType = 'teacher';
                }
            }

            // Check Admin if not found
            if (!user) {
                user = await adminRepository.findByEmail(email);
                if (user) {
                    userType = 'admin';
                }
            }

            // If no user found in any collection
            if (!user) {
                return {
                    success: false,
                    message: "User not found. Please check your email address."
                };
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid password"
                };
            }

            // Generate token
            const token = this.generateToken(
                user._id.toString(),
                user.email,
                user.first_name,
                user.last_name,
                userType
            );

            return {
                success: true,
                message: "Login successful",
                token,
                data: this.formatUserResponse(user, userType)
            };
        } catch (error: any) {
            console.error('Universal login error:', error);
            return {
                success: false,
                message: "Server error during login"
            };
        }
    }

    /**
     * Register Student
     */
    async registerStudent(data: RegisterData): Promise<AuthResponse> {
        try {
            const { email, mobile, nic } = data;

            // Check if student already exists
            const existingStudent = await studentRepository.findByEmailMobileOrNic(email, mobile, nic);

            if (existingStudent) {
                let message = "Student already exists";
                if (existingStudent.email === email) message = "Email already registered";
                if (existingStudent.mobile === mobile) message = "Mobile number already registered";
                if (existingStudent.nic === nic) message = "NIC already registered";

                return {
                    success: false,
                    message
                };
            }

            const student = await studentRepository.create(data);
            const token = this.generateToken(
                student._id.toString(),
                student.email,
                student.first_name,
                student.last_name,
                'student'
            );

            return {
                success: true,
                message: "Student registered successfully",
                token,
                data: this.formatUserResponse(student, 'student')
            };
        } catch (error: any) {
            console.error('Student registration error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Register Teacher
     */
    async registerTeacher(data: RegisterData): Promise<AuthResponse> {
        try {
            const { email, mobile, nic } = data;

            // Check if teacher already exists
            const existingTeacher = await teacherRepository.findByEmailMobileOrNic(email, mobile, nic);

            if (existingTeacher) {
                let message = "Teacher already exists";
                if (existingTeacher.email === email) message = "Email already registered";
                if (existingTeacher.mobile === mobile) message = "Mobile number already registered";
                if (existingTeacher.nic === nic) message = "NIC already registered";

                return {
                    success: false,
                    message
                };
            }

            const teacher = await teacherRepository.create(data);
            const token = this.generateToken(
                teacher._id.toString(),
                teacher.email,
                teacher.first_name,
                teacher.last_name,
                'teacher'
            );

            return {
                success: true,
                message: "Teacher registered successfully",
                token,
                data: this.formatUserResponse(teacher, 'teacher')
            };
        } catch (error: any) {
            console.error('Teacher registration error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Register Admin
     */
    async registerAdmin(data: RegisterData): Promise<AuthResponse> {
        try {
            const { email, mobile, nic } = data;

            // Check if admin already exists
            const existingAdmin = await adminRepository.findByEmailMobileOrNic(email, mobile, nic);

            if (existingAdmin) {
                let message = "Admin already exists";
                if (existingAdmin.email === email) message = "Email already registered";
                if (existingAdmin.mobile === mobile) message = "Mobile number already registered";
                if (existingAdmin.nic === nic) message = "NIC already registered";

                return {
                    success: false,
                    message
                };
            }

            const admin = await adminRepository.create({
                ...data,
                role: 'superadmin'
            });

            const token = this.generateToken(
                admin._id.toString(),
                admin.email,
                admin.first_name,
                admin.last_name,
                'superadmin'
            );

            return {
                success: true,
                message: "Admin registered successfully",
                token,
                data: this.formatUserResponse(admin, admin.role)
            };
        } catch (error: any) {
            console.error('Admin registration error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Student Login
     */
    async loginStudent(email: string, password: string): Promise<AuthResponse> {
        try {
            const student = await studentRepository.findByEmail(email);

            if (!student) {
                return {
                    success: false,
                    message: "Student not found"
                };
            }

            const isPasswordValid = await student.comparePassword(password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid password"
                };
            }

            const token = this.generateToken(
                student._id.toString(),
                student.email,
                student.first_name,
                student.last_name,
                'student'
            );

            return {
                success: true,
                message: "Login successful",
                token,
                data: this.formatUserResponse(student, 'student')
            };
        } catch (error: any) {
            console.error('Student login error:', error);
            return {
                success: false,
                message: "Server error"
            };
        }
    }

    /**
     * Teacher Login
     */
    async loginTeacher(email: string, password: string): Promise<AuthResponse> {
        try {
            const teacher = await teacherRepository.findByEmail(email);

            if (!teacher) {
                return {
                    success: false,
                    message: "Teacher not found"
                };
            }

            const isPasswordValid = await teacher.comparePassword(password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid password"
                };
            }

            const token = this.generateToken(
                teacher._id.toString(),
                teacher.email,
                teacher.first_name,
                teacher.last_name,
                'teacher'
            );

            return {
                success: true,
                message: "Login successful",
                token,
                data: this.formatUserResponse(teacher, 'teacher')
            };
        } catch (error: any) {
            console.error('Teacher login error:', error);
            return {
                success: false,
                message: "Server error"
            };
        }
    }

    /**
     * Admin Login
     */
    async loginAdmin(email: string, password: string): Promise<AuthResponse> {
        try {
            const admin = await adminRepository.findByEmail(email);

            if (!admin) {
                return {
                    success: false,
                    message: "Invalid credentials"
                };
            }

            const isPasswordValid = await admin.comparePassword(password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid credentials"
                };
            }

            const token = this.generateToken(
                admin._id.toString(),
                admin.email,
                admin.first_name,
                admin.last_name,
                admin.role
            );

            return {
                success: true,
                message: "Login successful",
                token,
                data: this.formatUserResponse(admin, admin.role)
            };
        } catch (error: any) {
            console.error('Admin login error:', error);
            return {
                success: false,
                message: "Server error"
            };
        }
    }
}

export default new AuthService();

