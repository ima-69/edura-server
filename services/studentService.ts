import { studentRepository } from "../repositories/index.js";
import { IStudent } from "../models/student.js";

export interface StudentResponse {
    success: boolean;
    message: string;
    data?: any;
    meta?: {
        total: number;
        page: number;
        pages: number;
    };
}

export class StudentService {
    /**
     * Get student details by ID
     */
    async getStudentDetails(id: string): Promise<StudentResponse> {
        try {
            const student = await studentRepository.findByIdWithFields(
                id,
                '_id first_name last_name mobile email student_status date_of_birth createdAt updatedAt'
            );

            if (!student) {
                return {
                    success: false,
                    message: "Student not found"
                };
            }

            return {
                success: true,
                message: "Student details retrieved successfully",
                data: {
                    student: {
                        id: student._id,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        mobile: student.mobile,
                        student_status: student.student_status,
                        email: student.email,
                        date_of_birth: student.date_of_birth,
                        created: student.createdAt,
                    }
                }
            };
        } catch (error: any) {
            console.error('Get student details error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Get all students with pagination
     */
    async getAllStudents(limit: number = 10, page: number = 1): Promise<StudentResponse> {
        try {
            let students: IStudent[];
            let totalStudents: number;

            if (limit > 0) {
                const skip = (page - 1) * limit;
                const result = await studentRepository.findAll(skip, limit);
                students = result.students;
                totalStudents = result.total;
            } else {
                students = await studentRepository.findAllNoPagination();
                totalStudents = students.length;
            }

            if (!students || students.length === 0) {
                return {
                    success: false,
                    message: "No students found"
                };
            }

            const studentArray = students.map((student) => ({
                id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                mobile: student.mobile,
                email: student.email,
                student_status: student.student_status,
                date_of_birth: student.date_of_birth,
                created: student.createdAt,
            }));

            return {
                success: true,
                message: "All student details retrieved",
                meta: {
                    total: totalStudents,
                    page,
                    pages: limit > 0 ? Math.ceil(totalStudents / limit) : 1
                },
                data: studentArray,
            };
        } catch (error: any) {
            console.error('Get all students error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Update student
     */
    async updateStudent(id: string, data: Partial<IStudent>): Promise<StudentResponse> {
        try {
            const student = await studentRepository.updateById(id, data);

            if (!student) {
                return {
                    success: false,
                    message: "Student not found or update failed"
                };
            }

            return {
                success: true,
                message: "Student details updated successfully",
                data: {
                    student: {
                        id: student._id,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        mobile: student.mobile,
                        email: student.email,
                        student_status: student.student_status,
                        date_of_birth: student.date_of_birth,
                        created: student.createdAt,
                    }
                }
            };
        } catch (error: any) {
            console.error('Update student error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Delete student
     */
    async deleteStudent(id: string): Promise<StudentResponse> {
        try {
            const result = await studentRepository.deleteById(id);

            if (!result) {
                return {
                    success: false,
                    message: "Student not found or already deleted"
                };
            }

            return {
                success: true,
                message: "Student deleted successfully"
            };
        } catch (error: any) {
            console.error('Delete student error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Change student status
     */
    async changeStudentStatus(id: string): Promise<StudentResponse> {
        try {
            const student = await studentRepository.toggleStatus(id);

            if (!student) {
                return {
                    success: false,
                    message: "Student not found"
                };
            }

            return {
                success: true,
                message: "Student status changed successfully",
                data: {
                    student: {
                        id: student._id,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        mobile: student.mobile,
                        email: student.email,
                        student_status: student.student_status,
                        date_of_birth: student.date_of_birth,
                        created: student.createdAt,
                    }
                }
            };
        } catch (error: any) {
            console.error('Change student status error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }

    /**
     * Find student by ID
     */
    async findStudentById(id: string): Promise<StudentResponse> {
        try {
            const student = await studentRepository.findByIdWithFields(
                id,
                "email first_name last_name mobile student_status"
            );

            if (!student) {
                return {
                    success: false,
                    message: "Student not found"
                };
            }

            return {
                success: true,
                message: "Student data retrieved",
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
            };
        } catch (error: any) {
            console.error('Find student by ID error:', error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }
}

export default new StudentService();

