import { Student, IStudent } from "../models/student.js";
import mongoose from "mongoose";

export class StudentRepository {
    /**
     * Find student by ID
     */
    async findById(id: string): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findById(id);
    }

    /**
     * Find student by email
     */
    async findByEmail(email: string): Promise<IStudent | null> {
        return await Student.findOne({ email }).select("+password");
    }

    /**
     * Find student with specific fields
     */
    async findByIdWithFields(id: string, fields: string): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findById(id).select(fields);
    }

    /**
     * Check if student exists by email, mobile, or NIC
     */
    async findByEmailMobileOrNic(email: string, mobile: string, nic: string): Promise<IStudent | null> {
        return await Student.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });
    }

    /**
     * Create new student
     */
    async create(data: Partial<IStudent>): Promise<IStudent> {
        return await Student.create(data);
    }

    /**
     * Get all students with pagination
     */
    async findAll(skip: number = 0, limit: number = 10): Promise<{
        students: IStudent[];
        total: number;
    }> {
        const students = await Student.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Student.countDocuments();
        
        return { students, total };
    }

    /**
     * Get all students without pagination
     */
    async findAllNoPagination(): Promise<IStudent[]> {
        return await Student.find().sort({ createdAt: -1 });
    }

    /**
     * Update student by ID
     */
    async updateById(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete student by ID
     */
    async deleteById(id: string): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findByIdAndDelete(id);
    }

    /**
     * Toggle student status
     */
    async toggleStatus(id: string): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findByIdAndUpdate(
            id,
            [{ $set: { student_status: { $not: "$student_status" } } }],
            { new: true }
        );
    }

    /**
     * Count all students
     */
    async count(): Promise<number> {
        return await Student.countDocuments();
    }

    /**
     * Find students by multiple IDs
     */
    async findByIds(ids: string[]): Promise<IStudent[]> {
        return await Student.find({ _id: { $in: ids } });
    }

    /**
     * Update student status
     */
    async updateStatus(id: string, status: boolean): Promise<IStudent | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Student.findByIdAndUpdate(
            id,
            { student_status: status },
            { new: true }
        );
    }
}

export default new StudentRepository();

