import mongoose from "mongoose";

// Import the default export from exam.ts
import Exam from "../models/exam.js";
import { IExam } from "../models/exam.js";

export class ExamRepository {
    /**
     * Find exam by ID
     */
    async findById(id: string): Promise<IExam | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Exam.findById(id);
    }

    /**
     * Create new exam
     */
    async create(data: Partial<IExam>): Promise<IExam> {
        return await Exam.create(data);
    }

    /**
     * Get all exams with pagination
     */
    async findAll(skip: number = 0, limit: number = 10): Promise<{
        exams: IExam[];
        total: number;
    }> {
        const exams = await Exam.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Exam.countDocuments();
        
        return { exams, total };
    }

    /**
     * Get all exams without pagination
     */
    async findAllNoPagination(): Promise<IExam[]> {
        return await Exam.find().sort({ createdAt: -1 });
    }

    /**
     * Find exams by class ID
     */
    async findByClassId(classId: string): Promise<IExam[]> {
        return await Exam.find({ class_id: classId }).sort({ createdAt: -1 });
    }

    /**
     * Update exam by ID
     */
    async updateById(id: string, data: Partial<IExam>): Promise<IExam | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Exam.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete exam by ID
     */
    async deleteById(id: string): Promise<IExam | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Exam.findByIdAndDelete(id);
    }

    /**
     * Count all exams
     */
    async count(): Promise<number> {
        return await Exam.countDocuments();
    }

    /**
     * Count exams by class
     */
    async countByClass(classId: string): Promise<number> {
        return await Exam.countDocuments({ class_id: classId });
    }

    /**
     * Find exams by type
     */
    async findByType(examType: number | string): Promise<IExam[]> {
        return await Exam.find({ exam_type: examType }).sort({ createdAt: -1 });
    }
}

export default new ExamRepository();

