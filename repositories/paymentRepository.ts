import { Payment, IPayment } from "../models/payments.js";
import mongoose from "mongoose";

export class PaymentRepository {
    /**
     * Find payment by ID
     */
    async findById(id: string): Promise<IPayment | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Payment.findById(id);
    }

    /**
     * Create new payment
     */
    async create(data: Partial<IPayment>): Promise<IPayment> {
        return await Payment.create(data);
    }

    /**
     * Get all payments with pagination
     */
    async findAll(skip: number = 0, limit: number = 10): Promise<{
        payments: IPayment[];
        total: number;
    }> {
        const payments = await Payment.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Payment.countDocuments();
        
        return { payments, total };
    }

    /**
     * Get all payments without pagination
     */
    async findAllNoPagination(): Promise<IPayment[]> {
        return await Payment.find().sort({ createdAt: -1 });
    }

    /**
     * Find payments by student ID
     */
    async findByStudentId(studentId: string): Promise<IPayment[]> {
        return await Payment.find({ student_id: studentId }).sort({ createdAt: -1 });
    }

    /**
     * Find payments by class ID
     */
    async findByClassId(classId: string): Promise<IPayment[]> {
        return await Payment.find({ class_id: classId }).sort({ createdAt: -1 });
    }

    /**
     * Find payment by student and class
     */
    async findByStudentAndClass(studentId: string, classId: string): Promise<IPayment | null> {
        return await Payment.findOne({ student_id: studentId, class_id: classId });
    }

    /**
     * Update payment by ID
     */
    async updateById(id: string, data: Partial<IPayment>): Promise<IPayment | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Payment.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete payment by ID
     */
    async deleteById(id: string): Promise<IPayment | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Payment.findByIdAndDelete(id);
    }

    /**
     * Count all payments
     */
    async count(): Promise<number> {
        return await Payment.countDocuments();
    }

    /**
     * Count payments by student
     */
    async countByStudent(studentId: string): Promise<number> {
        return await Payment.countDocuments({ student_id: studentId });
    }

    /**
     * Count payments by class
     */
    async countByClass(classId: string): Promise<number> {
        return await Payment.countDocuments({ class_id: classId });
    }

    /**
     * Get recent payments
     */
    async findRecent(limit: number = 10): Promise<IPayment[]> {
        return await Payment.find()
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * Get total revenue
     */
    async getTotalRevenue(): Promise<number> {
        return await Payment.countDocuments(); // This is just a count, you may want to add amount field to calculate actual revenue
    }
}

export default new PaymentRepository();

