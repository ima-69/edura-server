import { Admin, IAdmin } from "../models/admin.js";
import mongoose from "mongoose";

export class AdminRepository {
    /**
     * Find admin by ID
     */
    async findById(id: string): Promise<IAdmin | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Admin.findById(id);
    }

    /**
     * Find admin by email
     */
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await Admin.findOne({ email }).select("+password");
    }

    /**
     * Find admin with specific fields
     */
    async findByIdWithFields(id: string, fields: string): Promise<IAdmin | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Admin.findById(id).select(fields);
    }

    /**
     * Check if admin exists by email, mobile, or NIC
     */
    async findByEmailMobileOrNic(email: string, mobile: string, nic: string): Promise<IAdmin | null> {
        return await Admin.findOne({
            $or: [{ email }, { mobile }, { nic }]
        });
    }

    /**
     * Create new admin
     */
    async create(data: Partial<IAdmin>): Promise<IAdmin> {
        return await Admin.create(data);
    }

    /**
     * Get all admins
     */
    async findAll(): Promise<IAdmin[]> {
        return await Admin.find().sort({ createdAt: -1 });
    }

    /**
     * Update admin by ID
     */
    async updateById(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Admin.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete admin by ID
     */
    async deleteById(id: string): Promise<IAdmin | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Admin.findByIdAndDelete(id);
    }

    /**
     * Count all admins
     */
    async count(): Promise<number> {
        return await Admin.countDocuments();
    }
}

export default new AdminRepository();

