import { Class, IClass } from "../models/class.js";
import mongoose from "mongoose";

export class ClassRepository {
    /**
     * Find class by ID
     */
    async findById(id: string): Promise<IClass | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Class.findById(id);
    }

    /**
     * Find class by ID and populate teacher
     */
    async findByIdWithTeacher(id: string): Promise<IClass | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Class.findById(id).populate('teacher', 'first_name last_name email');
    }

    /**
     * Create new class
     */
    async create(data: Partial<IClass>): Promise<IClass> {
        return await Class.create(data);
    }

    /**
     * Get all classes with pagination
     */
    async findAll(skip: number = 0, limit: number = 10): Promise<{
        classes: IClass[];
        total: number;
    }> {
        const classes = await Class.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('teacher', 'first_name last_name email');
        
        const total = await Class.countDocuments();
        
        return { classes, total };
    }

    /**
     * Get all classes without pagination
     */
    async findAllNoPagination(): Promise<IClass[]> {
        return await Class.find()
            .sort({ createdAt: -1 })
            .populate('teacher', 'first_name last_name email');
    }

    /**
     * Find classes by teacher ID
     */
    async findByTeacherId(teacherId: string): Promise<IClass[]> {
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return [];
        }
        return await Class.find({ teacher: teacherId }).sort({ createdAt: -1 });
    }

    /**
     * Update class by ID
     */
    async updateById(id: string, data: Partial<IClass>): Promise<IClass | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Class.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete class by ID
     */
    async deleteById(id: string): Promise<IClass | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Class.findByIdAndDelete(id);
    }

    /**
     * Toggle class status
     */
    async toggleStatus(id: string): Promise<IClass | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Class.findByIdAndUpdate(
            id,
            [{ $set: { class_status: { $not: "$class_status" } } }],
            { new: true }
        );
    }

    /**
     * Count all classes
     */
    async count(): Promise<number> {
        return await Class.countDocuments();
    }

    /**
     * Count classes by teacher
     */
    async countByTeacher(teacherId: string): Promise<number> {
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return 0;
        }
        return await Class.countDocuments({ teacher: teacherId });
    }

    /**
     * Find active classes
     */
    async findActive(): Promise<IClass[]> {
        return await Class.find({ class_status: true })
            .sort({ createdAt: -1 })
            .populate('teacher', 'first_name last_name email');
    }
}

export default new ClassRepository();

