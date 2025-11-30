import { Teacher, ITeacher } from "../models/teacher.js";
import mongoose from "mongoose";

export class TeacherRepository {
    /**
     * Find teacher by ID
     */
    async findById(id: string): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findById(id);
    }

    /**
     * Find teacher by email
     */
    async findByEmail(email: string): Promise<ITeacher | null> {
        return await Teacher.findOne({ email }).select("+password");
    }

    /**
     * Find teacher with specific fields
     */
    async findByIdWithFields(id: string, fields: string): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findById(id).select(fields);
    }

    /**
     * Check if teacher exists by email, mobile, or NIC
     */
    async findByEmailMobileOrNic(email: string, mobile: string, nic: string): Promise<ITeacher | null> {
        return await Teacher.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });
    }

    /**
     * Create new teacher
     */
    async create(data: Partial<ITeacher>): Promise<ITeacher> {
        return await Teacher.create(data);
    }

    /**
     * Get all teachers with pagination
     */
    async findAll(skip: number = 0, limit: number = 10): Promise<{
        teachers: ITeacher[];
        total: number;
    }> {
        const teachers = await Teacher.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Teacher.countDocuments();
        
        return { teachers, total };
    }

    /**
     * Get all teachers without pagination
     */
    async findAllNoPagination(): Promise<ITeacher[]> {
        return await Teacher.find().sort({ createdAt: -1 });
    }

    /**
     * Update teacher by ID
     */
    async updateById(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete teacher by ID
     */
    async deleteById(id: string): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findByIdAndDelete(id);
    }

    /**
     * Toggle teacher status
     */
    async toggleStatus(id: string): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findByIdAndUpdate(
            id,
            [{ $set: { teacher_status: { $not: "$teacher_status" } } }],
            { new: true }
        );
    }

    /**
     * Count all teachers
     */
    async count(): Promise<number> {
        return await Teacher.countDocuments();
    }

    /**
     * Update teacher status
     */
    async updateStatus(id: string, status: boolean): Promise<ITeacher | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Teacher.findByIdAndUpdate(
            id,
            { teacher_status: status },
            { new: true }
        );
    }

    /**
     * Find teachers by subject
     */
    async findBySubject(subject: string): Promise<ITeacher[]> {
        return await Teacher.find({ subjects: subject });
    }
}

export default new TeacherRepository();

