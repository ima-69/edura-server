import { Request, Response } from "express";
import { Student } from "../models/student.js";
import { z } from "zod";
import mongoose from "mongoose";

const updateSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(), // accepts string & converts to Date
    mobile: z.string(),
    email: z.string().email(),
});

export const studentDetails = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }
        const student = await Student.findById(id).select('_id first_name last_name mobile email student_status date_of_birth createdAt updatedAt');
        if (!student) {
            return res.status(404).json({"message": "student not found"})
        }
        return res.status(200).json({
            message: "student details successfully",
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

        })
    }catch(err: any) {
        console.log(err);
        return res.status(500).json({
            "message": "Internal server error",
            "error": err.message
        })
    }

}

export const allStudents = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.l as string, 10) || 10;   // default limit = 10
        const page = parseInt(req.query.p as string, 10) || 1;     // default page = 1

        let students;
        let totalStudents = 0;

        if (limit > 0) {
            const skip = (page - 1) * limit;

            totalStudents = await Student.countDocuments();
            students = await Student.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        } else {
            students = await Student.find().sort({ createdAt: -1 });
            totalStudents = students.length;
        }

        if (!students || students.length === 0) {
            return res.status(404).json({
                message: "students not found"
            });
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

        return res.status(200).json({
            message: "all student details",
            meta: {
                total: totalStudents,
                page,
                pages: Math.ceil(totalStudents / limit)
            },
            data: studentArray,
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            message: "Internal Server Error",
            "error": e.message
        });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const parsed = updateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid data",
                errors: parsed.error.issues
            });
        }

        const id = req.query.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const student = await Student.findByIdAndUpdate(
            id,
            parsed.data,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "student not found or update failed"
            });
        }

        return res.status(200).json({
            message: "student details updated successfully",
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
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            "error": err.message
        });
    }
}

export const deleteStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.query.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const result = await Student.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({
                message: "student not found or already deleted",
            });
        }

        return res.status(200).json({
            message: "student deleted successfully",
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            message: "Internal server error",
            "error": e.message
        });
    }
};

export const changeStudentStatus = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const student = await Student.findByIdAndUpdate(
            id,
            [ { $set: { student_status: { $not: "$student_status" } } } ],
            { new: true } // return updated doc
        );
        if (!student) {
            return res.status(404).json({
                "message": "student not found"
            });
        }

        return res.status(200).json({
            message: "student change status successfully",
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
        })

    }catch(e: any){
        console.log(e);
        return res.status(500).json({
            "message": "Internal server error",
            "error": e.message
        })
    }
}

export const findStudentById = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid student id" });
    }
    console.log(id)
    const student = await Student.findById(id).select("email first_name last_name mobile");
    if(student) {
        return res.status(200).json({
            message: "student data",
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

        })
    }
    return res.status(404).json({ message: "Student not found" });
}

