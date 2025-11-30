import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/handler.js";
import { studentDetails, allStudents, updateStudent, deleteStudent, changeStudentStatus } from "../controllers/studentController.js";
import { Class } from "../models/class.js";
import { Student } from "../models/student.js";
import Exam from "../models/exam.js";
const router = Router();
// Existing routes (for admin/teacher use)
router.get("/studentDetails", auth(true), asyncHandler(studentDetails));
router.get("/allStudents", auth(true), asyncHandler(allStudents));
router.put("/updateStudent", auth(true), asyncHandler(updateStudent));
router.delete("/deleteStudent", auth(true), asyncHandler(deleteStudent));
router.patch("/studentStatus", auth(true), asyncHandler(changeStudentStatus));
// New student profile routes
// Get student dashboard stats
router.get("/dashboard", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    // Get student data
    const student = await Student.findById(studentId).populate('classes');
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    const enrolledCourses = student.classes?.length || 0;
    const completedCourses = 5; // TODO: Implement course completion tracking
    // Get pending exams for student's courses
    const courseIds = student.classes || [];
    const pendingExams = await Exam.countDocuments({
        class_id: { $in: courseIds }
        // TODO: Add date filter for upcoming exams
    });
    return res.status(200).json({
        success: true,
        data: {
            enrolledCourses,
            completedCourses,
            pendingExams,
            averageScore: '85%' // TODO: Calculate from exam results
        }
    });
}));
// Get student's enrolled courses
router.get("/courses", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    const student = await Student.findById(studentId).populate({
        path: 'classes',
        populate: {
            path: 'teacher',
            select: 'first_name last_name email'
        }
    });
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: student.classes || []
    });
}));
// Enroll in a course
router.post("/courses/enroll/:courseId", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    const { courseId } = req.params;
    // Check if course exists
    const course = await Class.findById(courseId);
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }
    // Get student
    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    // Check if already enrolled
    if (student.classes?.includes(courseId)) {
        return res.status(400).json({
            success: false,
            message: "Already enrolled in this course"
        });
    }
    // Enroll student
    if (!student.classes) {
        student.classes = [];
    }
    student.classes.push(courseId);
    await student.save();
    return res.status(200).json({
        success: true,
        message: "Successfully enrolled in course",
        data: student
    });
}));
// Get student's exams
router.get("/exams", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    // Get student's enrolled courses
    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    const courseIds = student.classes || [];
    // Get all exams for these courses
    const exams = await Exam.find({
        class_id: { $in: courseIds }
    }).populate('class_id', 'class_name')
        .sort({ createdAt: -1 });
    return res.status(200).json({
        success: true,
        data: exams
    });
}));
// Get student profile
router.get("/profile", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    const student = await Student.findById(studentId)
        .select('-password')
        .populate('classes', 'class_name description');
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: student
    });
}));
// Update student profile
router.put("/profile", auth(true, ['student']), asyncHandler(async (req, res) => {
    const studentId = req.user?.id;
    const { first_name, last_name, mobile, date_of_birth } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }
    // Update fields
    if (first_name)
        student.first_name = first_name;
    if (last_name)
        student.last_name = last_name;
    if (mobile)
        student.mobile = mobile;
    if (date_of_birth)
        student.date_of_birth = date_of_birth;
    await student.save();
    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: student
    });
}));
export default router;
//# sourceMappingURL=student.js.map